const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);

const page_type = urlParams.get('jsondata')



document.getElementById('clickEventDuration').innerHTML = JSON.parse(page_type);