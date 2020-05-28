
export const map = (key) => {
    //const regex = new RegExp(/\b[(?:\u0272\A-Z|A-Z)]/g);

    // let result = key.match(regex);
    // console.log(result);

    if(key === 'Huế') {
        return 'HUE'
    } else if(key.charAt(0) === 'Q') {
        let array = key.split(' ');
        let result = [];

        for(let i =0 ; i< array.length; i++) {
            result.push(array[i].charAt(0));
            if(i === array.length - 1) {
                result.push(array[i].slice(1,2).toUpperCase())
            }
        }
        return result.join('')
    } else {
        let array = key.split(' ');
        let result = [];
    
        for(const item of array) {
            result.push(item.charAt(0));
        }
    
        return result.join('');
    }

}