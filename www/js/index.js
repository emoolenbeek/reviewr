/**
 * @file index.js
 * @author Eric Moolenbeek <emoolenbeek@gmail.com>
 * @version 1.1
 */
const myKey = "mool0008-reviewr"; // local storage key
let imgURI = null;
var rating = 3;
var stars = [];
var id = "";
let currentReview = 0;
let reviewStorage = {
    "reviews": []
};


var app = {
    
    initialize: function () {
        document.addEventListener('deviceready', app.receivedEvent, false);

    },
    receivedEvent: function () {
        //localstorage
        if (!localStorage.getItem(myKey)) { // check localstorage for key
            localStorage.setItem(myKey, JSON.stringify(reviewStorage));
            console.log(localStorage);
            console.log("myKeyAdded");
        }
        stars = document.querySelectorAll('.star');
        app.addListeners();
        app.setRating(); // based on global rating variable value
        app.displayReiviews();
    },
    displayReiviews: function () {
        let list = document.getElementById("reviews");
        list.innerHTML = "";
        let savedReviews = JSON.parse(localStorage.getItem(myKey));
        console.log(savedReviews);
        if (savedReviews.reviews.length >= 1) {
            for (let i = 0; i < savedReviews.reviews.length; i++) {
                let li = document.createElement("li");
                let a = document.createElement("a");
                let img = document.createElement("img");
                let div = document.createElement("div");
                li.classList.add("table-view-cell", "media");

                a.classList.add("icon", "icon-trash", "pull-right", "midline");
                a.addEventListener('touchend', app.deletePhoto);
                a.setAttribute("data-id", savedReviews.reviews[i].id);
                a.addEventListener("touchstart", current.current);
                img.classList.add("media-object", "pull-left");
                img.setAttribute("height", "72");
                img.setAttribute("width", "72");
                img.setAttribute("src", savedReviews.reviews[i].img);
                div.classList.add("media-body");
                div.textContent = savedReviews.reviews[i].name;
                let reviewStars = document.createElement("div");
                reviewStars.classList.add("stars", "content-padded");
                for (let a = 0; a < savedReviews.reviews[i].rating; a++) {
                    let span = document.createElement("span");
                    span.classList.add("star", "rated");
                    
                    reviewStars.appendChild(span);
                }
                
                li.appendChild(div);
                li.appendChild(img);
                li.appendChild(reviewStars);
                li.appendChild(a);
                list.appendChild(li);
            }
        }
    },
    deleteModal: function () {
        let stored = JSON.parse(localStorage.getItem(myKey));
        let delImg = document.getElementById("ReviewImage");
        for (let i = 0; i < stored.reviews.length; i++) {
            if (currentReview == stored.reviews[i].id) {
                delImg.setAttribute("src", stored.reviews[i].img);
            }

        }
        app.displayReiviews();
    },

    addListeners: function () {
        let picture = document.getElementById("picture");
        let cancel = document.getElementById("cancel");
        let save = document.getElementById("save");
        let x = document.getElementById("x");
        picture.addEventListener('touchend', app.pictureModal);
        cancel.addEventListener('touchend', app.buttonClicked);
        save.addEventListener('touchstart', app.saveModal);
        save.addEventListener('touchend', app.buttonClicked);
        x.addEventListener('touchend', app.clearModal);


        for (var i = 0; i < stars.length; i++) {
            stars[i].addEventListener('touchend', (function (idx) {
                console.log('adding listener', idx);
                return function () {
                    rating = idx + 1;
                    console.log('Rating is now', rating)
                    app.setRating();
                }
            })(i));
        }
    },
    setRating: function () {
        for (var i = 0; i < stars.length; i++) {
            if (rating > i) {
                stars[i].classList.add('rated');
                console.log('added rated on', i);
            } else {
                stars[i].classList.remove('rated');
                console.log('removed rated on', i);
            }
        }
    },
    pictureModal: function () {
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
        navigator.camera.getPicture(app.onSuccess, app.onFail, options);
    },
    onSuccess: function (imageURI) {
        console.log("Camera cleanup success.")
        var image = document.getElementById("imgModal");
        console.log(imageURI);
        image.src = imageURI;
        //imgURI = imageURI;
    },
    onFail: function (message) {
        alert('Failed because: ' + message);
    },
    saveModal: function () {
        let localstore = JSON.parse(localStorage.getItem(myKey));

        currentReview == 0;
        if (currentReview == 0) {
            let timeStamp = Date.now();
            let review = {
                "id": timeStamp,
                "name": document.getElementById("item").value,
                "rating": rating,
                "img": imgURI
            };
            localstore.reviews.push(review);
            localstore = JSON.stringify(localstore);
            localStorage.setItem(myKey, localstore);
            app.clearModal();
            setTimeout(app.drawReviews, 350);
        }
    },
    buttonClicked: function (ev) {
        let myClick = new CustomEvent('touchend', {
            bubbles: true,
            cancelable: true
        });
        document.getElementById('x').dispatchEvent(myClick);
    },
    clearModal: function () {
        let item = document.getElementById("item");
        item.value = "";
        rating = 3;
        console.log("Clearing");
        app.displayReiviews();
    },
    deletePhoto: function () {
        let localstore = JSON.parse(localStorage.getItem(myKey));
        for (let i = 0; i < localstore.reviews.length; i++) {
            if (currentReview == localstore.reviews[i].id) {
                localstore.reviews.splice(i, 1);
            }
        }
        localstore = JSON.stringify(localstore);
        console.log(currentReview);
        console.log(localStorage);
        localStorage.setItem(myKey, localstore);
        currentReview = 0;
        app.displayReiviews();
        
    }
    

};

var current = {
    current: function (ev) {
        let x = ev.currentTarget;
        currentReview = x.getAttribute("data-id");
        app.deleteModal();
    }
}

app.initialize();