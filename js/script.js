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
                updateTime({
                    seconds: newVal,
                    minutes: '00',
                    hours: '00',
                });
                break;

            case newVal.length < 5:
                // minutes and seconds so far
                updateTime({
                    seconds: newVal.slice(-2),
                    minutes: newVal.slice(0, -2),
                    hours: '00',
                });
                break;

            default:
                // hours, minutes, and seconds
                updateTime({
                    seconds: newVal.slice(-2),
                    minutes: newVal.slice(-4, -2),
                    hours: newVal.slice(0, -4),
                });
                break;
        }
    }, false);

    document.querySelector('#set-timer').addEventListener('submit', e => {
        // get the value in the input field
        const duration = document.querySelector('#duration').value.padStart('000000');
        const hoursAsSeconds = 3600 * Number(duration.slice(0, -4));
        const minutesAsSeconds = 60 * Number(duration.slice(-4, -2));
        const seconds = Number(duration.slice(-2));
        const totalSeconds = hoursAsSeconds + minutesAsSeconds + seconds;
        if (totalSeconds < 1) {
            // no duration
            return;
        }
    }, false);

    function resetFieldToLastValue(field) {
        field.value = curVal;
    }

    function updateTime(time) {
        document.querySelector('.timer-container .seconds').textContent = time.seconds ? time.seconds.padStart(2, '0') : '00';
        document.querySelector('.timer-container .minutes').textContent = time.minutes ? time.minutes.padStart(2, '0') : '00';
        document.querySelector('.timer-container .hours').textContent = time.hours ? time.hours.padStart(2, '0') : '00';
    }
}
