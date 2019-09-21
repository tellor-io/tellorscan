// 0	UNSENT	Client has been created. open() not called yet.
const READY_STATE_UNSENT = 0;
// 1	OPENED	open() has been called.
const READY_STATE_OPENED = 1;
// 2	HEADERS_RECEIVED	send() has been called, and headers and status are available.
const READY_STATE_HEADERS_RECEIVED = 2;
// 3	LOADING	Downloading; responseText holds partial data.
const READY_STATE_LOADING = 3;
// 4	DONE
const READY_STATE_DONE = 4;


function _sendPayload(payload) {
    //console.log({event: 'sendPayload', host: this.host, timeout: this.timeout, agent: this.agent});
   return new Promise((resolve, reject) => {
       const request = this.providersModuleFactory.createXMLHttpRequest(
           this.host,
           this.timeout,
           [],
           this.agent
       );

       const responseHandler = () => {

         removeEventListeners();

         if (request.status === 200) {

           try {
               return resolve(JSON.parse(request.responseText));
           } catch (error) {
               reject(new Error(`Invalid JSON response: ${request.responseText}`));
           }
         } else {
           reject(new Error(`Response Code: ${request.status}: ${request.responseText}`));
         }
       };

       const readyStateChangeHandler = () => {
         if (request.readyState !== READY_STATE_UNSENT && request.readyState !== READY_STATE_OPENED) {
             this.connected = true;
         }

         if (request.readyState === READY_STATE_DONE) {
           responseHandler();
         }
       }

      const errorHandler = () => {
        removeEventListeners();
        reject(new Error(`Error performing request`))
      };

      const abortHandler = () => {
        removeEventListeners();
        reject(new Error(`Request aborted`))
      };

      const timeoutHandler = () => {
          this.connected = false;
          removeEventListeners();
          reject(new Error(`Connection error: Timeout exceeded after ${this.timeout}ms`));
      };

      const addEventListeners = () => {
        request.addEventListener('readystatechange', readyStateChangeHandler);
        request.addEventListener('error', errorHandler);
        request.addEventListener('abort', abortHandler);
        request.addEventListener('timeout', timeoutHandler);
      }

      const removeEventListeners = () => {
        request.removeEventListener('readystatechange', readyStateChangeHandler);
        request.removeEventListener('error', errorHandler);
        request.removeEventListener('abort', abortHandler);
        request.removeEventListener('timeout', timeoutHandler);
      }

       // allow setting unsafe headers ;-)
       const headers = this.headers || []
       headers.forEach((header) => {
         if (header.name.startsWith('Unsafe-')) {
           const unsafeHeaderName = header.name.replace('Unsafe-','');
           console.log(`setting unsafe header ${unsafeHeaderName}: ${header.value}`)
           request._headers[unsafeHeaderName] = header.value;
         }
       })

       addEventListeners();

       try {
           request.send(JSON.stringify(payload));
       } catch (error) {
           if (error.constructor.name === 'NetworkError') {
               this.connected = false;
           }

           removeEventListeners();
           reject(error);
       }
   });
}


export default class HttpProviderPatch {

  static patch(provider) {
    provider.sendPayload = _sendPayload.bind(provider);
  }

}