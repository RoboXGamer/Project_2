import Library from "/Scripts/MyLibrary.js";

const mouseFollower = Library.mouseFollower();
console.log(mouseFollower);

Library.makeMagnetGSAP(".magnet", {
	distance: 200,
	strength: 0.2,
	animationDuration: 0.2,
});
