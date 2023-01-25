import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
import { fetchImages } from './js/fetchImages';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
// 11497081-cc65ac3ee2055db377a22cee7  KEY
const btnSearch = document.querySelector('.search-form-button');
const input = document.querySelector('.search-form-input');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');
let gallerySimpleLightbox = new SimpleLightbox('.gallery a');
btnLoadMore.style.display = 'none';
let pageNumber = 1;
let per_page = 40;


btnSearch.addEventListener('click', onSearchBtn);

function onSearchBtn(evt) {
  btnLoadMore.style.display = 'none';
  evt.preventDefault();
  cleanGallery();
  const trimmedValue = input.value.trim();
  if (trimmedValue === '') {
    return;
  }
  fetchImages(trimmedValue, pageNumber).then(foundData => {
    console.log(foundData);
    if (foundData.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      if (pageNumber < Math.ceil(foundData.totalHits / per_page)) {
        btnLoadMore.style.display = 'block';
      }
      renderImageList(foundData.hits);
      Notiflix.Notify.success(
        `Hooray! We found ${foundData.totalHits} images.`
      );
      gallerySimpleLightbox.refresh();
    }
    // }  else {
    //   renderImageList(foundData.hits);
    //   Notiflix.Notify.success(
    //     `Hooray! We found ${foundData.totalHits} images.`
    //   );
    //   btnLoadMore.style.display = 'block';
    //   gallerySimpleLightbox.refresh();
    // }
  });
}
btnLoadMore.addEventListener('click', () => {
  pageNumber += 1;
  const trimmedValue = input.value.trim();
  btnLoadMore.style.display = 'none';
  fetchImages(trimmedValue, pageNumber).then(foundData => {
    if (foundData.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (pageNumber < Math.ceil(foundData.totalHits / per_page)) {
      renderImageList(foundData.hits);
      btnLoadMore.style.display = 'flex';
      Notiflix.Notify.success(`We found ${foundData.hits.length} images.`);
      gallerySimpleLightbox.refresh();
    }
    
    else if (pageNumber === Math.ceil(foundData.totalHits / per_page)) {
      renderImageList(foundData.hits);
      btnLoadMore.style.display = 'none';
      Notiflix.Notify.success(`We found ${foundData.hits.length} images.`);
    }
  });
});

function renderImageList(images) {
  const markup = images
    .map(
      image => `<div class="photo-card">
       <a href="${image.largeImageURL}"><img class="photo" src="${image.webformatURL}" alt="${image.tags}" title="${image.tags}" loading="lazy"/></a>
        <div class="info">
           <p class="info-item">
    <b>Likes</b> <span class="info-item-api"> ${image.likes} </span>
</p>
            <p class="info-item">
                <b>Views</b> <span class="info-item-api">${image.views}</span>  
            </p>
            <p class="info-item">
                <b>Comments</b> <span class="info-item-api">${image.comments}</span>  
            </p>
            <p class="info-item">
                <b>Downloads</b> <span class="info-item-api">${image.downloads}</span> 
            </p>
        </div>
    </div>`
    )
    .join('');
  gallery.innerHTML += markup;
}

function cleanGallery() {
  gallery.innerHTML = '';
  pageNumber = 1;
  btnLoadMore.style.display = 'none';
}
