export const capitalize = (str) =>
  typeof str === "string" && str.length > 0
    ? str.charAt(0).toUpperCase() + str.slice(1)
    : "";

export const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

function generateRandomAvatarUrl() {
  const baseUrl = "https://avataaars.io/";

  const options = {
    avatarStyle: ["Circle", "Transparent"],
    topType: [
      "NoHair", "Eyepatch", "Hat", "Hijab", "LongHairBun", "ShortHairShortFlat",
      "ShortHairFrizzle", "LongHairStraight2"
    ],
    accessoriesType: ["Blank", "Kurt", "Prescription01", "Prescription02", "Round"],
    hairColor: ["Auburn", "Black", "Blonde", "Blue", "Brown", "Gray"],
    facialHairType: ["Blank", "BeardMedium", "BeardLight", "MoustacheMagnum"],
    facialHairColor: ["Auburn", "Black", "Blonde", "Brown", "BrownDark"],
    clotheType: ["BlazerShirt", "CollarSweater", "Hoodie", "ShirtScoopNeck", "Overall"],
    clotheColor: ["Black", "Blue01", "Blue03", "Gray01", "Heather"],
    skinColor: ["Light", "Brown", "DarkBrown", "Black", "Tanned", "Pale"],
    eyeType: ["Default", "Happy", "Squint", "Wink", "Surprised"],
    eyebrowType: ["Default", "RaisedExcited", "UpDown", "SadConcerned"],
    mouthType: ["Default", "Smile", "Serious", "Disbelief", "Eating"],
  };

  const queryParams = Object.entries(options)
    .map(([key, values]) => `${key}=${getRandom(values)}`)
    .join("&");

  return `${baseUrl}?${queryParams}`;
}

export function getRandomAvatar() {
  return generateRandomAvatarUrl();
}