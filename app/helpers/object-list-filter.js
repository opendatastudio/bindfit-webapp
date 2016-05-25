export default function objectListFilter(list, key, value) {
    /***
     * Searches a list of objects for one that contains the given
     * key:value pair, and returns the entry that matches or null
     * if no match found.
     */

    var match = null;

    // Use for (instead of forEach) to allow breaking early
    for (let i = 0; i < list.length; i++) {
        let item = list[i];
        if (item[key] === value) {
            match = item;
            break;
        }
    }

    return match;
}
