window.addEventListener('load', (event) => {
    var localhost = location.hostname === "localhost" || location.hostname === "127.0.0.1";
    if (!localhost){
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('service-worker.js')
            .then(function(registration) {
                // Registration was successful
                // console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }).catch(function(err) {
                // registration failed :(
                // console.log('ServiceWorker registration failed: ', err);
            });
        }
    }
});