

/**
 * Validates if the specified parameter in the URL matches the given object's id.
 * @param {Object} object - The object containing the ID to match against,can be userId, matchId etc.
 * @param {Object} location - The location object provided by React Router.
 * @param {number} nr - The segment number of the URL path to match against the object's ID.
 * @returns {boolean} - True if the IDs match, otherwise false.
 */

export const matchPathWithParameter = (object, location, nr) => {
  if (!object || !object.id || !location || !location.pathname) {
    console.warn("Invalid arguments passed to matchPathWithParameter.");

    return false;
  }

  const pathSegments = location.pathname.split("/");
  if (nr >= pathSegments.length) {
    console.error("The URL does not contain enough segments to match the given index.");

    return false;
  }

  const pathId = pathSegments[nr];

  return object.id.toString() === pathId;
};


