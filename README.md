# Unsplash JS Browser
This is a small javascript app that uses services workers to cache fetch requests from the Unsplash API.

## Features
- Unsplash API
- Service workers for cache
- Infinite scrolling
- Search

## Heads Up
The service worker caches all requests from `images.unsplash.com` and `api.unsplash.com`. The more photos you load onto the page, the more cache is stored. The images from Unsplash are `regular` quality (about 2-3mb per image). Long story short, the cache grows fast and at some point will run out of storage.  

## Demo
https://unsplash-dfe57.firebaseapp.com/
