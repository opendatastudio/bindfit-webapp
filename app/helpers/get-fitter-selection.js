export default function getFitterSelection(fitter, fitList) {
    /***
     * Return full fitter selection details given fitter key
     */

    var match = null;

    for (let i = 0; i < fitList.length; i++) {
        if (fitList[i].key === fitter) {
            match = fitList[i];
            break;
        }
    }

    return match;
}
