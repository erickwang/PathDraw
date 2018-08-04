

window.pathdraw = window.pathdraw || {};

export function modify(e, box, bboxGroup, onMove, onUp) {
    if (window.pathdraw.isDrawing === true) {
        return;
    }
    let lastTime = new Date().getTime();
    let mouseMove = (e) => {
        const now = new Date().getTime();
        if (now - lastTime < 200) {
            //return;
        }

        lastTime = now;
        onMove(e.clientX, e.clientY);
    }

    const debounce = (func, delay) => {
        let inDebounce
        return function() {
          const context = this
          const args = arguments
          clearTimeout(inDebounce)
          inDebounce = setTimeout(() => func.apply(context, args), delay)
        }
      }

    const mouseUp = (e) => {
        document.removeEventListener('mousemove', mouseMove);
        document.removeEventListener('mouseup', mouseUp);
        window.pathdraw.isDrawing = false;
        onUp(e.clientX, e.clientY);
        bboxGroup.setAttribute("display", 'block');
    }

    this.box = document.querySelector('svg').getBoundingClientRect();

    //mouseMove = debounce(mouseMove);
    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
    window.pathdraw.isDrawing = true;
    bboxGroup.setAttribute("display", 'none');
    const rect = box.getBoundingClientRect();
    return {
        x: parseInt(e.clientX),
        y: parseInt(e.clientY)
    };
}

function debounce(func, wait = 10, immediate = true) {
    var timeout;
    return function() {
        var context = this,
            args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};


function addNew() {

}

