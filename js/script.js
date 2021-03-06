document.addEventListener('DOMContentLoaded', () => {
    initialize();
}, false);

function initialize() {
    let curVal = '',
        timer = null,
        end,
        isRunning = false,
        timeRem = {
            seconds: '',
            minutes: '',
            hours: '',
        },
        expired = true;
    document.querySelector('.duration-container input').addEventListener('keyup', e => {
        handleUserInput(e.target.value);
    }, false);

    document.querySelector('#set-timer').addEventListener('submit', e => {
        e.preventDefault();
        // pause the beeper if it's playing
        toggleBeeper('pause');
        const durationField = e.target.querySelector('#duration');
        if (isRunning) {
            // timer is running, so pause it
            clearTimer();
            durationField.disabled = false;
            // update the text of the button
            showStartPauseText();
            isRunning = false;
            if (expired) {
                // reset the user's selection in preparation for a repeat of the
                // last timer
                curVal = '';
                handleUserInput(durationField.value);
            }
            expired = false;
            return;
        }
        expired = false;
        const hoursAsSeconds = 3600 * Number(timeRem.hours);
        const minutesAsSeconds = 60 * Number(timeRem.minutes);
        const seconds = Number(timeRem.seconds);
        const totalSeconds = hoursAsSeconds + minutesAsSeconds + seconds;
        if (totalSeconds < 1) {
            // no duration
            return;
        }
        isRunning = true;

        // remove focus from the duration field and disable it
        durationField.blur();
        durationField.disabled = true;

        showStartPauseText('start');
        end = new Date(((Date.now() / 1000) + totalSeconds) * 1000);
        timer = setTimeout(function() {
            updateTimerDisplay();
        }, 1000);
    }, false);

    document.querySelector('#set-timer').addEventListener('reset', e => {
        e.preventDefault();
        resetTimer();
    });

    function handleUserInput(newVal) {
        if (newVal === curVal) {
            resetFieldToLastValue();
            return;
        }
        const asNumber = Number(newVal);
        if (Number.isNaN(asNumber) || asNumber < 0) {
            resetFieldToLastValue();
            return;
        }
        if (newVal.length > 6) {
            // invalid number of characters
            resetFieldToLastValue();
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
    }

    function resetFieldToLastValue() {
        document.querySelector('.duration-container input').value = curVal;
    }

    function updateTime(time) {
        timeRem.seconds = time.seconds ? time.seconds.padStart(2, '0') : '00';
        timeRem.minutes = time.minutes ? time.minutes.padStart(2, '0') : '00';
        timeRem.hours = time.hours ? time.hours.padStart(2, '0') : '00';
        document.querySelector('.timer-container .seconds').textContent = timeRem.seconds;
        document.querySelector('.timer-container .minutes').textContent = timeRem.minutes;
        document.querySelector('.timer-container .hours').textContent = timeRem.hours;
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
            expired = true;
            // first stop the timer
            clearTimer();
            // then play the audio
            toggleBeeper();
        } else {
            // schedule the next update
            timer = setTimeout(updateTimerDisplay, 1000);
            // make sure the beeper is not playing
            toggleBeeper('pause');
        }
    }

    function showStartPauseText(val) {
        if (val === 'start') {
            document.querySelector('.btns-container button[type="submit"]').textContent = 'Stop';
        } else {
            document.querySelector('.btns-container button[type="submit"]').textContent = 'Start';
        }
    }

    function toggleBeeper(val) {
        if (val === 'pause') {
            document.querySelector('audio#beeper').pause();
        } else {
            document.querySelector('audio#beeper').play().catch(console.log);
        }
    }

    function clearTimer() {
        clearTimeout(timer);
        timer = null;
    }

    function resetTimer() {
        // stop beeper
        toggleBeeper('pause');
        // reset state variables
        expired = true;
        isRunning = false;
        clearTimer();
        // reactivate the input field
        const durationField = document.querySelector('#duration');
        durationField.disabled = false;
        // reset the input and display
        handleUserInput('');
        resetFieldToLastValue();
        showStartPauseText();
    }
}
