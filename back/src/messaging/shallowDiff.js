import {
  DIFF_STATUS_UPDATED,
  DIFF_STATUS_REMOVED
} from './constants';

/**
 * Returns a new Object containing only the fields in `new` that differ from `old`
 *
 * @param {Object} old
 * @param {Object} new
 * @return {Array} An array of changes. The changes have a `key`, `value`, and `change`.
 *   The change is either `updated`, which is if the value has changed or been added,
 *   or `removed`.
 */
export default function shallowDiff(oldObj, newObj) {
  const difference = [];

  Object.keys(newObj).forEach((key) => {
    if (oldObj[key] !== newObj[key]) {
      // console.log('DIFFERENCE FOUND: (oldObj[key] !== newObj[key])', oldObj[key] , newObj[key], key)
      difference.push({
        key,
        value: newObj[key],
        change: DIFF_STATUS_UPDATED,
      });
    }
  });

  Object.keys(oldObj).forEach(key => {
    if (!newObj[key]) {
      // console.log('DIFFERENCE FOUND: (!newObj[key])', key, newObj[key])
      difference.push({
        key,
        change: DIFF_STATUS_REMOVED,
      });
    }
  });


  // console.log('DIFFERENCE AFTER: ', difference);

  return difference;
}
