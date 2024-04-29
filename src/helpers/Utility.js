

/**
 * Validates if the specified parameter in the URL matches the given object's id.
 * @param {Object} object - The object containing the ID to match against,can be userId, matchId etc.
 * @param {Object} location - The location object provided by React Router.
 * @param {number} nr - The segment number of the URL path to match against the object's ID.
 * @returns {boolean} - True if the IDs match, otherwise false.
 */

export const matchPathWithParameter = (object, location, nr) => {
  const pathSegments = location.pathname.split('/');
  const pathId = pathSegments[nr];
  return object.id === pathId;
};

