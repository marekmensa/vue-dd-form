const viewTypes = {
    COLLECTION: 'collection',
    GROUP: 'group',
    TEXT: 'text',
    SELECT: 'select',
    CHECKBOX: 'checkbox',
    COUNTER: 'counter',
    DATETIME: 'datetime',
    UPLOAD: 'upload',
    AREA: 'area',
    RADIO: 'radio',
    TICK: 'tick',
  };
  
  const defaultViewValues = {
    collection: [],
    group: {},
    text: '',
    select: '',
    checkbox: [],
    counter: 0,
    datetime: new Date(),
    upload: '',
    area: '',
    radio: '',
    tick: false,
  };

  export {
    viewTypes,
    defaultViewValues,
  };
  