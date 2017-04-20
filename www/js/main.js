//document.addEventListener('DOMContentLoaded', init);
//window.addEventListener("push", pages);
let output = document.getElementsByClassName("content");
const myKey = "mool0008-reviewr"; // local storage key
let myArray = []; // local storage array
let myReviews = []; // review arrays
let imgURI = null;
var rating = 3;
var stars = [];
var id = "";


function init() {
    if (!localStorage.getItem(myKey)) { // check localstorage for key
        localStorage.setItem(myKey, JSON.stringify(myArray));
        console.log("myKeyAdded");
    }
    stars = document.querySelectorAll('.star');
    addListeners();
    setRating(); // based on global rating variable value
}

//if (document.deviceReady) {
document.addEventListener('deviceready', init);
//}
//else {
//    document.addEventListener('DOMContentLoaded', init)
//}

//document.addEventListener("deviceready", onDeviceReady, false);
//function onDeviceReady() {
//    console.log(navigator.camera);
//}

function addListeners() {
    let picture = document.getElementById("picture");
    let cancel = document.getElementById("cancel");
    let save = document.getElementById("save");
    let x = document.getElementById("x");
    picture.addEventListener('touchend', pictureModal);
    cancel.addEventListener('touchend', buttonClicked);
    save.addEventListener('touchstart', saveModal);
    save.addEventListener('touchend', buttonClicked);
    x.addEventListener('touchend', clearModal);


    for (var i = 0; i < stars.length; i++) {
        stars[i].addEventListener('touchend', (function (idx) {
            console.log('adding listener', idx);
            return function () {
                rating = idx + 1;
                console.log('Rating is now', rating)
                setRating();
            }
        })(i));
    }
}
//  [].forEach.call(stars, function (star, index) {
//        star.addEventListener('touchend', (function (idx) {
//            console.log('adding listener', index);
//            return function () {
//                rating = idx + 1;
//                console.log('Rating is now', rating)
//                setRating();
//            }
//        })(index));
//    });



function setRating() {
    for (var i = 0; i < stars.length; i++) {
        if (rating > i) {
            stars[i].classList.add('rated');
            console.log('added rated on', i);
        } else {
            stars[i].classList.remove('rated');
            console.log('removed rated on', i);
        }
    }
    //  [].forEach.call(stars, function (star, index) {
    //        if (rating > index) {
    //            star.classList.add('rated');
    //            console.log('added rated on', index);
    //        } else {
    //            star.classList.remove('rated');
    //            console.log('removed rated on', index);
    //        }
    //    });
}

function pictureModal() {
    console.log("picture modal");
    var options = {
        quality: 80,
        destinationType: Camera.DestinationType.FILE_URI,
        encodingType: Camera.EncodingType.PNG,
        mediaType: Camera.MediaType.PICTURE,
        pictureSourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        targetWidth: 300,
        targetHeight: 300
    }
    navigator.camera.cleanup(onSuccess, onFail, options);
}

function onSuccess(imageURI) {
    console.log("Camera cleanup success.")
    var image = document.getElementById("imgModal");
    image.src = imageURI;
    imgURI = imageURI;
}

function onFail(message) {
    alert('Failed because: ' + message);
}

function saveModal() {
    console.log("saving modal");
    let modalName = document.getElementById("item").value;
    let modalRating = rating;

    let review = {
        "id": Date.now(),
        "name": modalName,
        "rating": modalRating,
        "img": imgURI
    }

    myReviews.push(review);

    localStorage.setItem(myKey, JSON.stringify(myReviews));

    console.log(review);

}

function buttonClicked(ev) {
    let myClick = new CustomEvent('touchend', {
        bubbles: true,
        cancelable: true
    });
    document.getElementById('x').dispatchEvent(myClick);
}

function clearModal() {
    let item = document.getElementById("item");
    item.value = "";
    rating = 3;
    console.log("Clearing");
}