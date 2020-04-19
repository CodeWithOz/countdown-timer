document.addEventListener('DOMContentLoaded', () => {
    initialize();
}, false);

function initialize() {
    let curVal = '', timer, end;
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
        e.preventDefault();
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

        end = new Date(((Date.now() / 1000) + totalSeconds) * 1000);
        timer = setTimeout(function() {
            updateTimerDisplay();
        }, 1000);
    }, false);

    function resetFieldToLastValue(field) {
        field.value = curVal;
    }

    function updateTime(time) {
        document.querySelector('.timer-container .seconds').textContent = time.seconds ? time.seconds.padStart(2, '0') : '00';
        document.querySelector('.timer-container .minutes').textContent = time.minutes ? time.minutes.padStart(2, '0') : '00';
        document.querySelector('.timer-container .hours').textContent = time.hours ? time.hours.padStart(2, '0') : '00';
    }

    function updateTimerDisplay() {
        // get the time since the start
        const now = new Date();
        const nowSeconds = now.getSeconds();
        const nowMinutes = now.getMinutes();
        const nowHours = now.getHours();
        const remSeconds = String(end.getSeconds() - nowSeconds);
        const remMinutes = String(end.getMinutes() - nowMinutes);
        const remHours = String(end.getHours() - nowHours);

        // update the timer display
        updateTime({
            seconds: remSeconds,
            minutes: remMinutes,
            hours: remHours,
        });

        if (now >= end) {
            // timer has expired
            clearTimeout(timer);
            timer = null;
        } else {
            // schedule the next update
            timer = setTimeout(updateTimerDisplay, 1000);
        }
    }
}