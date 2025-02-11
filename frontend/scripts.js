let onboardItems = document.getElementsByClassName("onboarditem");
function moveToTracking() {
    for (let i = 0; i < onboardItems.length; i++) {
        onboardItems[i].style.visibility = "hidden";
    }

}
const Mood = {
    Happy: 2,
    Neutral: 1,
    Sad: 0
}

class Vape {
    name;
    puffs;
    cost;
}

//make json object to send objects to back-end!!

class TrackingPurchase {
    constructor(date, mood, vape) {
        this.date = date;
        this.mood = mood;
        this.vape = vape;
    }
    date;
    mood;  //mood enum
    vape;  //vape class to call back
}

class TrackingThrowaway {
    constructor(date, mood) {
        this.date = date;
        this.mood = mood;
    }
    date;
    mood; //mood enum
}