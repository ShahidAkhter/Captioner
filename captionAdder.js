const startTimerBtn = document.getElementById('startTimerBtn');
const endTimerBtn = document.getElementById('endTimerBtn');
const startTimerDisplayer = document.getElementById('startTimerDisplayer');
const endTimerDisplayer = document.getElementById('endTimerDisplayer');
const submit = document.getElementById('submit');
const captionWriter = document.getElementById('captionWriter');
const captionContainer = document.getElementById('captionContainer');
let captionArr = [];
let editIndex = 0;
captionContainer.innerText = 'Captions will display here...';

startTimerBtn.addEventListener('click', () => {
    startTimerDisplayer.value = getPodcastLength(audio.currentTime);
});

endTimerBtn.addEventListener('click', () => {
    endTimerDisplayer.value = getPodcastLength(audio.currentTime);
});

submit.addEventListener('click', () => {
    if (captionWriter.value === '' || startTimerDisplayer.value === endTimerDisplayer.value) {
        return;
    }

    if (captionContainer.innerText === 'Captions will display here...') {
        captionContainer.innerText = '';
    }

    captionArr.push({
        "startTime": startTimerDisplayer.value,
        "endTime": endTimerDisplayer.value,
        "captionIs": captionWriter.value
    });
    captionWriter.value = '';
    localStorage.setItem(`${fileName.innerHTML}`, JSON.stringify(captionArr));
    addingCaptions();
});

const addingCaptions = () => {
    addingCaptionsHTML()
    Array.from(document.getElementsByClassName('deleteCaption')).forEach(element => {
        element.addEventListener('click', () => {
            const i = Number.parseInt(element.id.split('delete')[1]);
            captionArr.splice(i, 1);
            const captionElement = document.getElementById(`caption${i}`);
            captionElement.parentNode.removeChild(captionElement);
            localStorage.setItem(`${fileName.innerHTML}`, JSON.stringify(captionArr));

            if (captionContainer.innerText === '') {
                captionContainer.innerText = 'Captions will display here...';
            }
        });
    });
    Array.from(document.getElementsByClassName('editCaption')).forEach(element => {
        element.addEventListener('click', () => {
            editIndex = Number.parseInt(element.id.split('edit')[1]);
            editChange(false)
            document.getElementById(`captionEditWriter`).value = document.getElementById(`captionIsElement${editIndex}`).innerText
            document.getElementById(`startTimerEditDisplayer`).value = document.getElementById(`startTimeElement${editIndex}`).innerText
            document.getElementById(`endTimerEditDisplayer`).value = document.getElementById(`endTimeElement${editIndex}`).innerText
            document.getElementById('sideBarName').innerText = `Edit-Enabled-${editIndex + 1}`
        });
    });
}

const addingCaptionsHTML = () => {
    captionContainer.innerHTML = "";
    captionArr.forEach((element, index) => {
        captionContainer.innerHTML += `
      <div class="outlineRange bg-1 text-size p-5-10 border-round-5 mb-10" id="caption${index}">
      <div class="textsDiv" id="captionIsElement${index}">${element.captionIs}</div>
      <div class="flex align-right f-wrap">
      <div class="bg p-5-10 m-4 btns text-size-1 border-round-5" id="index${index}">${index + 1}</div>
          <div class="bg p-5-10 m-4 btns text-size-1 border-round-5" id="startTimeElement${index}">${element.startTime}</div>
          <div class="bg p-5-10 m-4 btns text-size-1 border-round-5" id="endTimeElement${index}">${element.endTime}</div>
          <button class="bg p-5-10 m-4 btns text-size-1 border-round-5 editCaption" id="edit${index}">Edit</button>
          <button class="bg p-5-10 m-4 btns text-size-1 border-round-5 deleteCaption" id="delete${index}">Delete</button>
        </div>
      </div>`;
    });
}

document.getElementById(`editSubmit`).addEventListener('click', () => {
    captionArr[editIndex]["startTime"] = document.getElementById(`startTimerEditDisplayer`).value;
    captionArr[editIndex]["endTime"] = document.getElementById(`endTimerEditDisplayer`).value;
    captionArr[editIndex]["captionIs"] = document.getElementById(`captionEditWriter`).value;
    localStorage.setItem(`${fileName.innerHTML}`, JSON.stringify(captionArr));
    addingCaptions();
    editChange(true)
    document.getElementById('sideBarName').innerText = `Edit-Disabled-${editIndex + 1}`
})

const editChange = (valueIs) => {
    document.getElementById('captionEditWriter').disabled = valueIs
    document.getElementById('startTimerEditDisplayer').disabled = valueIs
    document.getElementById('endTimerEditDisplayer').disabled = valueIs
    document.getElementById('editSubmit').disabled = valueIs
}


document.getElementById('documentFile').addEventListener('change', function () {
    let file = this.files[0];
    Array.from(document.getElementsByClassName('fileNameOption')).forEach(element => {
        element.innerHTML=file.name
    });
    audio.src = URL.createObjectURL(file);
    document.getElementById(`captionAdderComponent`).classList.remove('displayNone')
    document.getElementById(`formMP3`).classList.add('displayNone')
    if (!localStorage.getItem(`${fileName.innerHTML}`)) {
        localStorage.setItem(`${fileName.innerHTML}`, '[]');
    } else {
        captionArr = JSON.parse(localStorage.getItem(`${fileName.innerHTML}`));
        addingCaptions()
        if (captionContainer.innerText === '') {
            captionContainer.innerText = 'Captions will display here...';
        }
    }
});

document.getElementById('copy').addEventListener('click', () => {
    const jsonString = JSON.stringify(captionArr);
    if (jsonString == '[]') {
        document.getElementById('copy').innerText = "None"
        setTimeout(() => {
            document.getElementById('copy').innerText = "Copy"
        }, 500);
        return;
    }

    navigator.clipboard.writeText(jsonString).then(() => {
        document.getElementById('copy').innerText = "Copied";
        setTimeout(() => {
            document.getElementById('copy').innerText = "Copy"
        }, 500);
    }).catch((error) => {
        document.getElementById('copy').innerText = "Not Able To Copy...";

    });
})
document.getElementById('clearCaptions').addEventListener('click', () => {
    captionArr = [];
    localStorage.removeItem(`${fileName.innerHTML}`)
    addingCaptions();
    if (captionContainer.innerText === '') {
        captionContainer.innerText = 'Captions will display here...';
    }
})