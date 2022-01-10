import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-storage.js";

const firebaseConfig = {
  // your firebase config here
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const dropZone = document.querySelector(".dropzone");
const fileInput = document.querySelector("#file");
const uploading = document.querySelector(".uploading");
const uploadSuccess = document.querySelector(".upload-success");
const progressBar = document.querySelector("#progress");
const uploadedImage = document.querySelector("#uploaded-image");
const imageLink = document.querySelector("#image-link");
const copyLinkButton = document.querySelector("#copy-link-button");
const container = document.querySelector(".container");

// handle drop zone
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  e.stopPropagation();
  dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", (e) => {
  e.preventDefault();
  e.stopPropagation();
  dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  e.stopPropagation();
  dropZone.classList.remove("dragover");
  fileInput.files = e.dataTransfer.files;
  console.log(fileInput.files);
  uploadFile();
});

// handle file input when choosing file from button
fileInput.addEventListener("change", () => {
  uploadFile();
});

// handle select file button
const selectFileButton = document.querySelector("#select-file");
selectFileButton.addEventListener("click", () => {
  fileInput.click();
});

// upload file
function uploadFile() {
  container.classList.add("hidden");
  uploading.classList.remove("hidden");
  const file = fileInput.files[0];
  const fileName = file.name;
  const storageRef = ref(storage, `${fileName}`);
  const uploadTask = uploadBytesResumable(storageRef, file);
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      progressBar.value = progress;
      console.log(progress);
    },
    (error) => {
      console.log(error);
    },
    () => {
      getDownloadURL(storageRef).then((url) => {
        console.log(url);
        uploading.classList.add("hidden");
        uploadSuccess.classList.remove("hidden");

        imageLink.value = url;
        imageLink.title = url;
        uploadedImage.src = url;

        // copy on click
        imageLink.addEventListener("click", () => {
          imageLink.select();
          document.execCommand("copy");
          copyLinkButton.innerText = "Copied!";
          copyLinkButton.classList.add("copied");
          setTimeout(() => {
            copyLinkButton.classList.remove("copied");
            copyLinkButton.innerText = "Copy Link";
          }, 3000);
        });
        copyLinkButton.addEventListener("click", () => {
          imageLink.select();
          document.execCommand("copy");
          copyLinkButton.innerText = "Copied!";
          copyLinkButton.classList.add("copied");
          setTimeout(() => {
            copyLinkButton.classList.remove("copied");
            copyLinkButton.innerText = "Copy Link";
          }, 3000);
        });
      });
    }
  );
}
