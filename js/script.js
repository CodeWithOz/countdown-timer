document.addEventListener('DOMContentLoaded', () => {
    initialize();
}, false);

function initialize() {
    let curVal = '';
    document.querySelector('.duration-container input').addEventListener('keyup', e => {
        const newVal = e.target.value;
        if (newVal === curVal) {
            resetFieldToLastValue(e.target);
            return;
        }
        const asNumber = Number(newVal);
        if (Number.isNaN(asNumber) || asNumber < 0) {
            resetFieldToLastValue(e.target);
            return;
        }
        if (newVal.length > 6) {
            // invalid number of characters
            resetFieldToLastValue(e.target);
            return;
        }
        curVal = newVal;
        switch (true) {
            case newVal.length < 3:
                // only seconds so far
                updateTime({ seconds: newVal });
                break;

            case newVal.length < 5:
                // minutes and seconds so far
                updateTime({ seconds: newVal.slice(-2), minutes: newVal.slice(0, -2) });
                break;

            default:
                break;
        }
    }, false);

    function resetFieldToLastValue(field) {
        field.value = curVal;
    }

    function updateTime(time) {
        if (time.seconds) {
            document.querySelector('.timer-container .seconds').textContent = time.seconds.padStart(2, '0');
        }
        if (time.minutes) {
            document.querySelector('.timer-container .minutes').textContent = time.minutes.padStart(2, '0');
        }
    }
}
