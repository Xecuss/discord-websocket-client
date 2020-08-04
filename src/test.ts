import axios from 'axios';

(async () => {
    const res = await axios.get('https://google.com');
    console.log(res);
})();