export const userPhonePerEventAgg = (datetime) => {
    return ([
  {
    '$match': {
      'date': new Date(datetime)
    }
  }, {
    '$lookup': {
      'from': 'users', 
      'localField': 'users', 
      'foreignField': '_id', 
      'as': 'userDetails'
    }
  }, {
    '$project': {
      'userDetails.phone': 1
    }
  }
]);
}

export const userPerEventAgg = (datetime) => {
    return ([
  {
    '$match': {
      'date': {
        '$eq': new Date(datetime)
      }
    }
  }, {
    '$project': {
      'users': 1, 
      '_id': 0
    }
  }
])
};
