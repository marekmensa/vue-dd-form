const functions = require('firebase-functions');
const axios = require('axios').default;
const moment = require('moment');
const cors = require('cors');
const corsHandler = cors({ origin: true });
const helpers = require('./helpers');

const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

/* ===
  sends 'welcome' email
  === */
exports.userCreated = functions.firestore
  .document('users/{user}')
  .onCreate((snap) => {
    return axios
      .post('https://api.attendu.cz/api/ucime-se', {
        type: 'welcome',
        email: snap.data().email,
        data: {},
      })
      .then((response) => {
        return response;
      });
  });

/* ===
  sends 'preparation' or 'invite' email
  === */
exports.lessonChanged = functions.firestore
  .document('lessons/{lesson}')
  .onWrite(async (change, context) => {
    if (!change.after.exists) return null;
    const data = change.after.data();
    let name = '';
    let school = '';
    let email = data.author;
    let title = data.title;
    let date = moment(data.start).format('D.M. [od] HH:mm');

    await db
      .collection('users')
      .doc(email)
      .get()
      // eslint-disable-next-line promise/always-return
      .then((doc) => {
        name = doc.data().name;
        school = doc.data().school;
      });

    const payload = {
      title,
      name,
      school,
      date,
    };

    let type = '';

    if (!change.before.exists) {
      type = 'preparation';
    } else if (
      change.before.data().status === 'draft' &&
      change.after.data().status === 'live'
    ) {
      type = 'invite';
    }

    if (!type || data.invited) return null;

    if (type === 'invite') await change.after.ref.update({ invited: true });

    for (const viewerKey of Object.keys(data.viewers)) {
      payload.link = `https://ucime.se/lesson/${change.after.id}/${viewerKey}`;
      // eslint-disable-next-line no-await-in-loop
      await helpers.sendEmail(type, email, payload);
    }
    return type;
  });

/* ===
  handles viewer interaction
  === */
exports.viewerUpdate = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const { action, value, lesson, viewer } = req.body;
    const lessonRef = db.collection('lessons').doc(lesson);
    await lessonRef.get().then(async (doc) => {
      const data = doc.data();
      const viewerEmail = data.viewers[viewer].email;
      if (action === 'camera') {
        const viewersWindowIndex = data.windows.findIndex(
          (window) => window.participant === viewerEmail
        );
        let newWindows = data.windows;
        newWindows[viewersWindowIndex].camera = value;
        await lessonRef.update({ windows: newWindows });
      } else if (action === 'waving') {
        const key = `viewers.${viewer}.waving`;
        await lessonRef.update({ [key]: value });
      } else if (action === 'name') {
        const key = `viewers.${viewer}.name`;
        await lessonRef.update({ [key]: value });
      }
      return null;
    });
    res.status(200).send(`${viewer} updated`);
  });
});

/* ===
  changes lesson status
  === */
exports.statusChange = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const { email, name, school, lesson, value } = req.body;
    let userExists = false;
    await db
      .collection('users')
      .doc(email)
      .get()
      .then((doc) => {
        userExists = doc.exists;
        return null;
      });
    const lessonRef = db.collection('lessons').doc(lesson);
    await lessonRef.get().then(async (doc) => {
      const data = doc.data();
      if(!doc.exists || data.author !== email || !userExists) {
        res.status(500).send('not found');
      }
      const validator = ['draft', 'ended', 'live'];
      if (validator.indexOf(value) !== -1)
        await lessonRef.update({ status: value });
      if (value === 'live' && !data.invited) {
        await lessonRef.update({ invited: true });
        for (const viewerKey of Object.keys(data.viewers)) {
          const payload = {
            title: data.title,
            name,
            school,
            date: moment(data.start).format('D.M. [od] HH:mm'),
          };
          payload.link = `https://ucime.se/lesson/${viewerKey}/${viewerKey}`;
          // eslint-disable-next-line no-await-in-loop
          await helpers.sendEmail('invite', email, payload);
        }
      } else if (value === 'ended') {
        for (const viewerKey of Object.keys(data.viewers)) {
          const key = `viewers.${viewerKey}.online`;
          // eslint-disable-next-line no-await-in-loop
          await lessonRef.update({ [key]: false });
        }
      }
      return null;
    });
    res.status(200).send(`${lesson} changed status`);
  });
});
