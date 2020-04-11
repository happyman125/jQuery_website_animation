export const throttle = (fn, wait) => {
  let time = Date.now()
  return () => {
    if ((time + wait - Date.now()) < 0) {
      fn()
      time = Date.now()
    }
  }
}

export const extend = (a, b) => {
  for (let key in b) {
    if (b.hasOwnProperty(key)) {
      a[key] = b[key]
    }
  }
  return a
}

export const diff = (list1, list2) => {
  let lookup = {}

  //console.log('diff')

  for (let j = 0; j < list2.length; j++) {
    lookup[list2[j].textContent] = list2[j].textContent
  }

  for (let i = 0; i < list1.length; i++) {

    if (typeof lookup[list1[i].textContent] === 'undefined') {
      let id = list1[i].htmlFor
      if (id !== 'undefined') {
        document.getElementById(id).style.display = 'none'
        list1[i].style.display = 'none'
        break;
      }
    }
  }
}

export const forEach = (array, callback, scope) => {
  for (var i = 0, len = array.length; i < len; i++) {
    callback.call(scope, i, array[i]);
  }
}
