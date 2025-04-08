
//llamamos a los archivos del firebase y lo configuramos
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
import { getFirestore, collection, addDoc , getDocs} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDY-pv-MPHqT2Gbt0CzwWkSAxJlnjutCQs",
  authDomain: "blastercannon-62be5.firebaseapp.com",
  projectId: "blastercannon-62be5",
  storageBucket: "blastercannon-62be5.appspot.com",
  messagingSenderId: "351566702728",
  appId: "1:351566702728:web:e207de185763194c2e573d",
  measurementId: "G-FL2E60ZRFB"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

window.saveTask = (name,points)=>{
    addDoc(collection(firestore, 'LeaderBoard'),{name,points})
}

window.getTask = () =>{
    return getDocs(collection(firestore, 'LeaderBoard'))
}