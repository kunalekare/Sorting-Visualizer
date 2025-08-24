// --- DOM Elements & State ---
const container = document.getElementById('visualizer-container');
const generateBtn = document.getElementById('generateBtn');
const sortBtn = document.getElementById('sortBtn');
const pauseBtn = document.getElementById('pauseBtn');
const sizeSlider = document.getElementById('sizeSlider');
const speedSlider = document.getElementById('speedSlider');
const algorithmSelect = document.getElementById('algorithmSelect');
const explanationBox = document.getElementById('explanation-box');
const codeBox = document.getElementById('code-box');
const customArrayBtn = document.getElementById('customArrayBtn');
const customArrayModal = document.getElementById('customArrayModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalSubmitBtn = document.getElementById('modalSubmitBtn');
const customArrayInput = document.getElementById('customArrayInput');
const modalError = document.getElementById('modal-error');

let array = [];
let isSorting = false;
let isPaused = false;
let forceStop = false;

// --- Algorithm Information Store (Now Complete) ---
const algorithmData = {
    bubbleSort: {
        name: "Bubble Sort",
        code: `function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`
    },
    selectionSort: {
        name: "Selection Sort",
        code: `function selectionSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
  return arr;
}`
    },
    insertionSort: {
        name: "Insertion Sort",
        code: `function insertionSort(arr) {
  let n = arr.length;
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`
    },
    cocktailShakerSort: {
        name: "Cocktail Shaker Sort",
        code: `function cocktailShakerSort(arr) {
  let swapped = true;
  let start = 0;
  let end = arr.length;
  while (swapped) {
    swapped = false;
    for (let i = start; i < end - 1; ++i) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
      }
    }
    if (!swapped) break;
    swapped = false;
    end--;
    for (let i = end - 1; i >= start; --i) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
      }
    }
    start++;
  }
  return arr;
}`
    },
    gnomeSort: {
        name: "Gnome Sort",
        code: `function gnomeSort(arr) {
  let index = 0;
  while (index < arr.length) {
    if (index === 0) index++;
    if (arr[index] >= arr[index - 1]) {
      index++;
    } else {
      [arr[index], arr[index - 1]] = [arr[index - 1], arr[index]];
      index--;
    }
  }
  return arr;
}`
    },
    oddEvenSort: {
        name: "Odd-Even Sort",
        code: `function oddEvenSort(arr) {
  let sorted = false;
  while (!sorted) {
    sorted = true;
    for (let i = 1; i < arr.length - 1; i += 2) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        sorted = false;
      }
    }
    for (let i = 0; i < arr.length - 1; i += 2) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        sorted = false;
      }
    }
  }
  return arr;
}`
    },
    mergeSort: {
        name: "Merge Sort",
        code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  let result = [], l = 0, r = 0;
  while (l < left.length && r < right.length) {
    if (left[l] < right[r]) {
      result.push(left[l++]);
    } else {
      result.push(right[r++]);
    }
  }
  return result.concat(left.slice(l)).concat(right.slice(r));
}`
    },
    quickSort: {
        name: "Quick Sort",
        code: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    let pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  let pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`
    },
    heapSort: {
        name: "Heap Sort",
        code: `function heapSort(arr) {
  let n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  return arr;
}

function heapify(arr, n, i) {
  let largest = i, l = 2 * i + 1, r = 2 * i + 2;
  if (l < n && arr[l] > arr[largest]) largest = l;
  if (r < n && arr[r] > arr[largest]) largest = r;
  if (largest != i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`
    },
    countingSort: {
        name: "Counting Sort",
        code: `function countingSort(arr) {
  const max = Math.max(...arr);
  const count = Array(max + 1).fill(0);
  for (let i = 0; i < arr.length; i++) {
    count[arr[i]]++;
  }
  let sortedIndex = 0;
  for (let i = 0; i < count.length; i++) {
    while (count[i] > 0) {
      arr[sortedIndex++] = i;
      count[i]--;
    }
  }
  return arr;
}`
    },
    radixSort: {
        name: "Radix Sort",
        code: `function radixSort(arr) {
  let max = Math.max(...arr);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countingSortForRadix(arr, exp);
  }
  return arr;
}

function countingSortForRadix(arr, exp) {
  let n = arr.length;
  let output = new Array(n);
  let count = new Array(10).fill(0);
  for (let i = 0; i < n; i++) count[Math.floor(arr[i] / exp) % 10]++;
  for (let i = 1; i < 10; i++) count[i] += count[i - 1];
  for (let i = n - 1; i >= 0; i--) {
    output[count[Math.floor(arr[i] / exp) % 10] - 1] = arr[i];
    count[Math.floor(arr[i] / exp) % 10]--;
  }
  for (let i = 0; i < n; i++) arr[i] = output[i];
}`
    },
    bucketSort: {
        name: "Bucket Sort",
        code: `function bucketSort(arr, bucketSize = 5) {
  if (arr.length === 0) return arr;
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const bucketCount = Math.floor((max - min) / bucketSize) + 1;
  const buckets = new Array(bucketCount);
  for (let i = 0; i < buckets.length; i++) buckets[i] = [];
  
  for (let i = 0; i < arr.length; i++) {
    const bucketIndex = Math.floor((arr[i] - min) / bucketSize);
    buckets[bucketIndex].push(arr[i]);
  }

  arr.length = 0;
  for (let i = 0; i < buckets.length; i++) {
    insertionSort(buckets[i]); // Sort each bucket
    for (let j = 0; j < buckets[i].length; j++) {
      arr.push(buckets[i][j]);
    }
  }
  return arr;
}`
    },
    shellSort: {
        name: "Shell Sort",
        code: `function shellSort(arr) {
  const n = arr.length;
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i += 1) {
      let temp = arr[i];
      let j;
      for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
        arr[j] = arr[j - gap];
      }
      arr[j] = temp;
    }
  }
  return arr;
}`
    },
    pancakeSort: {
        name: "Pancake Sort",
        code: `function pancakeSort(arr) {
  for (let n = arr.length; n > 1; n--) {
    let maxIdx = 0;
    for (let i = 1; i < n; i++) {
      if (arr[i] > arr[maxIdx]) maxIdx = i;
    }
    if (maxIdx !== n - 1) {
      flip(arr, maxIdx + 1);
      flip(arr, n);
    }
  }
  return arr;
}

function flip(arr, k) {
  let l = 0;
  while (l < k - 1) {
    [arr[l], arr[k - 1]] = [arr[k - 1], arr[l]];
    l++;
    k--;
  }
}`
    },
    bogoSort: {
        name: "Bogo Sort",
        code: `function bogoSort(arr) {
  while (!isSorted(arr)) {
    // Fisher-Yates shuffle
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  return arr;
}

function isSorted(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) return false;
  }
  return true;
}`
    }
};

// --- Event Listeners ---
window.onload = () => { generateNewArray(); updateSidePanel(); };
generateBtn.addEventListener('click', () => generateNewArray());
sizeSlider.addEventListener('input', () => generateNewArray());
sortBtn.addEventListener('click', startSort);
pauseBtn.addEventListener('click', togglePause);
algorithmSelect.addEventListener('change', updateSidePanel);
customArrayBtn.addEventListener('click', () => customArrayModal.classList.remove('hidden'));
modalCloseBtn.addEventListener('click', () => customArrayModal.classList.add('hidden'));
modalSubmitBtn.addEventListener('click', handleCustomArraySubmit);

// --- Control & UI Functions ---
function updateSidePanel() {
    const selectedAlgo = algorithmSelect.value;
    codeBox.textContent = algorithmData[selectedAlgo].code;
    updateExplanation(`<strong>${algorithmData[selectedAlgo].name}</strong>: Ready to sort.`);
}
function updateExplanation(text) { explanationBox.innerHTML = text; }

function disableControls() {
    isSorting = true;
    forceStop = false;
    sortBtn.textContent = 'Reset';
    sortBtn.removeEventListener('click', startSort);
    sortBtn.addEventListener('click', handleReset);
    sortBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
    sortBtn.classList.add('bg-red-500', 'hover:bg-red-600');
    
    pauseBtn.disabled = false;
    pauseBtn.classList.remove('opacity-50', 'cursor-not-allowed');

    [generateBtn, sizeSlider, algorithmSelect, customArrayBtn].forEach(el => {
        el.disabled = true;
        el.classList.add('opacity-50', 'cursor-not-allowed');
    });
}

function enableControls() {
    isSorting = false;
    isPaused = false;
    sortBtn.textContent = 'Sort';
    sortBtn.removeEventListener('click', handleReset);
    sortBtn.addEventListener('click', startSort);
    sortBtn.classList.remove('bg-red-500', 'hover:bg-red-600');
    sortBtn.classList.add('bg-green-500', 'hover:bg-green-600');

    pauseBtn.disabled = true;
    pauseBtn.textContent = 'Pause';
    pauseBtn.classList.add('opacity-50', 'cursor-not-allowed');

    [generateBtn, sizeSlider, algorithmSelect, customArrayBtn].forEach(el => {
        el.disabled = false;
        el.classList.remove('opacity-50', 'cursor-not-allowed');
    });
}

function togglePause() {
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
    updateExplanation(isPaused ? 'Paused.' : 'Resumed.');
}

async function handleReset() {
    forceStop = true;
    isPaused = false;
    await new Promise(resolve => setTimeout(resolve, 20));
    enableControls();
    generateNewArray();
}

async function sleep(ms) {
    while (isPaused && !forceStop) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (forceStop) return Promise.reject('Sort aborted');
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getSpeed() {
    const maxDelay = 1000, minDelay = 5;
    const sliderMin = parseInt(speedSlider.min), sliderMax = parseInt(speedSlider.max);
    const percent = (parseInt(speedSlider.value) - sliderMin) / (sliderMax - sliderMin);
    return maxDelay - (maxDelay - minDelay) * percent;
}

// --- Array Generation ---
function generateNewArray(customArr = null) {
    if (isSorting && !forceStop) return;
    forceStop = false;
    array = [];
    container.innerHTML = '';
    let arrToProcess = [], displayHeights = [];
    if (customArr) {
        arrToProcess = customArr;
        sizeSlider.value = customArr.length;
        const minVal = Math.min(...arrToProcess), maxVal = Math.max(...arrToProcess);
        const minHeight = 5, maxHeight = 100;
        if (minVal === maxVal) {
            displayHeights = arrToProcess.map(() => 50);
        } else {
            displayHeights = arrToProcess.map(val => minHeight + ((val - minVal) * (maxHeight - minHeight)) / (maxVal - minVal));
        }
    } else {
        const arraySize = sizeSlider.value;
        for (let i = 0; i < arraySize; i++) arrToProcess.push(Math.floor(Math.random() * 96) + 5);
        displayHeights = arrToProcess;
    }
    array = arrToProcess;
    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement('div');
        bar.style.height = `${displayHeights[i]}%`;
        bar.dataset.value = array[i];
        bar.classList.add('bar', 'bar-default');
        bar.style.width = `${100 / array.length}%`;
        
        const barLabel = document.createElement('span');
        barLabel.classList.add('bar-label');
        const barValue = document.createElement('span');
        barValue.classList.add('bar-value');
        barValue.textContent = array[i];
        if (array.length > 70) barValue.style.display = 'none';
        
        bar.appendChild(barLabel);
        bar.appendChild(barValue);
        container.appendChild(bar);
    }
    updateSidePanel();
}

function handleCustomArraySubmit() {
    modalError.textContent = '';
    const input = customArrayInput.value.trim();
    if (!input) { modalError.textContent = 'Input cannot be empty.'; return; }
    const arr = input.split(',').map(s => s.trim()).filter(Boolean).map(Number);
    if (arr.some(isNaN)) { modalError.textContent = 'Please enter valid numbers only.'; return; }
    if (arr.length > 100) { modalError.textContent = 'Maximum of 100 elements allowed.'; return; }
    if (arr.some(n => n < 1 || n > 100)) { modalError.textContent = 'Values must be between 1 and 100.'; return; }
    generateNewArray(arr);
    customArrayModal.classList.add('hidden');
    customArrayInput.value = '';
}

// --- Sorting Orchestrator ---
async function startSort() {
    if (isSorting) return;
    disableControls();
    const algorithm = window[algorithmSelect.value];
    try {
        await algorithm();
        if (!forceStop) {
            const bars = document.getElementsByClassName('bar');
            for(const bar of bars) {
                setColor(bar, 'bar-sorted');
                setBarLabel(bar, '');
            }
            updateExplanation("Sorting complete!");
        }
    } catch (error) {
        if (error !== 'Sort aborted') console.error(error);
    } finally {
        if (!forceStop) enableControls();
    }
}

// --- Bar Helpers ---
function setColor(bar, colorClass) { if(bar) { bar.className = 'bar'; bar.classList.add(colorClass); } }
function getBarValue(bar) { return parseInt(bar.dataset.value); }
function setBarLabel(bar, text) { if (bar) bar.querySelector('.bar-label').textContent = text; }
function swap(bar1, bar2) {
    [bar1.style.height, bar2.style.height] = [bar2.style.height, bar1.style.height];
    [bar1.dataset.value, bar2.dataset.value] = [bar2.dataset.value, bar1.dataset.value];
    const val1 = bar1.querySelector('.bar-value'), val2 = bar2.querySelector('.bar-value');
    if (val1 && val2) [val1.textContent, val2.textContent] = [val2.textContent, val1.textContent];
}
function setBarData(targetBar, sourceBar) {
    targetBar.style.height = sourceBar.style.height;
    targetBar.dataset.value = sourceBar.dataset.value;
    const targetSpan = targetBar.querySelector('.bar-value'), sourceSpan = sourceBar.querySelector('.bar-value');
    if (targetSpan && sourceSpan) targetSpan.textContent = sourceSpan.textContent;
}
function setBarDataFromValues(bar, value, height) {
    bar.style.height = height;
    bar.dataset.value = value;
    const span = bar.querySelector('.bar-value');
    if (span) span.textContent = value;
}
async function updateAllBars(values) {
    const bars = document.getElementsByClassName('bar');
    for (let i = 0; i < values.length; i++) {
        if(forceStop) return;
        const minVal = Math.min(...values), maxVal = Math.max(...values);
        const height = 5 + ((values[i] - minVal) * 95) / (maxVal - minVal || 1);
        setBarDataFromValues(bars[i], values[i], `${height}%`);
        setColor(bars[i], 'bar-swapping');
    }
    await sleep(getSpeed() * 2);
}

// --- Sorting Algorithms ---
async function bubbleSort() {
    const bars = document.getElementsByClassName('bar');
    const n = bars.length;
    for (let i = 0; i < n - 1; i++) {
        if (forceStop) return;
        updateExplanation(`<strong>Pass ${i + 1}:</strong> Finding the next largest element to bubble up.`);
        setBarLabel(bars[n - 1 - i], 'sorted');
        for (let j = 0; j < n - i - 1; j++) {
            if (forceStop) return;
            const bar1 = bars[j], bar2 = bars[j+1];
            setBarLabel(bar1, 'j'); setBarLabel(bar2, 'j+1');
            setColor(bar1, 'bar-comparing'); setColor(bar2, 'bar-comparing');
            updateExplanation(`Comparing adjacent elements ${getBarValue(bar1)} and ${getBarValue(bar2)}.`);
            await sleep(getSpeed()); if (forceStop) return;
            if (getBarValue(bar1) > getBarValue(bar2)) {
                updateExplanation(`${getBarValue(bar1)} > ${getBarValue(bar2)}. Swapping to move the larger element right.`);
                setColor(bar1, 'bar-swapping'); setColor(bar2, 'bar-swapping');
                await sleep(getSpeed()); if (forceStop) return;
                swap(bar1, bar2);
            } else {
                updateExplanation(`${getBarValue(bar1)} <= ${getBarValue(bar2)}. No swap needed.`);
            }
            setBarLabel(bar1, ''); setBarLabel(bar2, '');
            setColor(bar1, 'bar-default'); setColor(bar2, 'bar-default');
        }
        setColor(bars[n - 1 - i], 'bar-sorted');
        updateExplanation(`Element ${getBarValue(bars[n - 1 - i])} is now in its final sorted position.`);
    }
    if (n > 0) { setColor(bars[0], 'bar-sorted'); setBarLabel(bars[0], 'sorted'); }
}

async function selectionSort() {
    const bars = document.getElementsByClassName('bar');
    const n = bars.length;
    for (let i = 0; i < n - 1; i++) {
        if (forceStop) return;
        let minIdx = i;
        setBarLabel(bars[i], 'i'); setBarLabel(bars[minIdx], 'min');
        setColor(bars[i], 'bar-pivot');
        updateExplanation(`<strong>Pass ${i + 1}:</strong> Searching for the minimum value in the unsorted part (from index ${i}).`);
        await sleep(getSpeed()); if (forceStop) return;
        for (let j = i + 1; j < n; j++) {
            if (forceStop) return;
            setBarLabel(bars[j], 'j');
            setColor(bars[j], 'bar-comparing');
            updateExplanation(`Comparing current minimum (${getBarValue(bars[minIdx])}) with element at index j (${getBarValue(bars[j])}).`);
            await sleep(getSpeed()); if (forceStop) return;
            if (getBarValue(bars[j]) < getBarValue(bars[minIdx])) {
                updateExplanation(`Found a new minimum: ${getBarValue(bars[j])}.`);
                setBarLabel(bars[minIdx], (minIdx === i) ? 'i' : '');
                if(minIdx !== i) setColor(bars[minIdx], 'bar-default');
                minIdx = j;
                setBarLabel(bars[minIdx], 'min');
                setColor(bars[minIdx], 'bar-pivot');
            }
            if (minIdx !== j) setBarLabel(bars[j], '');
            setColor(bars[j], 'bar-default');
        }
        updateExplanation(`Swapping the minimum (${getBarValue(bars[minIdx])}) with the element at index i (${getBarValue(bars[i])}).`);
        setColor(bars[minIdx], 'bar-swapping'); setColor(bars[i], 'bar-swapping');
        await sleep(getSpeed()); if (forceStop) return;
        swap(bars[i], bars[minIdx]);
        setBarLabel(bars[minIdx], ''); setBarLabel(bars[i], 'sorted');
        if(minIdx !== i) setColor(bars[minIdx], 'bar-default');
        setColor(bars[i], 'bar-sorted');
    }
    if (n > 0) { setColor(bars[n - 1], 'bar-sorted'); setBarLabel(bars[n - 1], 'sorted'); }
}

async function insertionSort() {
    const bars = document.getElementsByClassName('bar');
    const n = bars.length;
    setColor(bars[0], 'bar-sorted');
    for (let i = 1; i < n; i++) {
        if (forceStop) return;
        let keyHeight = bars[i].style.height;
        let keyVal = getBarValue(bars[i]);
        setBarLabel(bars[i], 'key');
        setColor(bars[i], 'bar-pivot');
        updateExplanation(`Picking ${keyVal} as the 'key' to insert into the sorted left part.`);
        await sleep(getSpeed()); if (forceStop) return;
        let j = i - 1;
        while (j >= 0 && getBarValue(bars[j]) > keyVal) {
            if (forceStop) return;
            setBarLabel(bars[j], 'j');
            updateExplanation(`Key ${keyVal} is smaller than ${getBarValue(bars[j])}, so we shift ${getBarValue(bars[j])} to the right.`);
            setColor(bars[j], 'bar-comparing'); setColor(bars[j+1], 'bar-swapping');
            setBarData(bars[j + 1], bars[j]);
            await sleep(getSpeed()); if (forceStop) return;
            setBarLabel(bars[j], '');
            setColor(bars[j], 'bar-sorted'); setColor(bars[j+1], 'bar-sorted');
            j = j - 1;
        }
        setBarDataFromValues(bars[j + 1], keyVal, keyHeight);
        updateExplanation(`Found the correct spot. Inserting key ${keyVal}.`);
        await sleep(getSpeed()); if (forceStop) return;
        for(let k=0; k<=i; k++) {
            setColor(bars[k], 'bar-sorted');
            setBarLabel(bars[k], '');
        }
    }
}

async function mergeSort() {
    const bars = Array.from(document.getElementsByClassName('bar'));
    async function merge(l, m, r) {
        const n1 = m - l + 1, n2 = r - m;
        let L = new Array(n1), R = new Array(n2);
        for (let i = 0; i < n1; i++) L[i] = { height: bars[l + i].style.height, value: getBarValue(bars[l + i]) };
        for (let j = 0; j < n2; j++) R[j] = { height: bars[m + 1 + j].style.height, value: getBarValue(bars[m + 1 + j]) };
        let i = 0, j = 0, k = l;
        while (i < n1 && j < n2) {
            if (forceStop) return;
            setColor(bars[k], 'bar-comparing');
            updateExplanation(`Merging: Comparing ${L[i].value} (left) and ${R[j].value} (right).`);
            await sleep(getSpeed()); if (forceStop) return;
            if (L[i].value <= R[j].value) {
                updateExplanation(`Placing ${L[i].value} into the main array.`);
                setBarDataFromValues(bars[k], L[i].value, L[i].height); i++;
            } else {
                updateExplanation(`Placing ${R[j].value} into the main array.`);
                setBarDataFromValues(bars[k], R[j].value, R[j].height); j++;
            }
            setColor(bars[k], 'bar-swapping'); k++;
        }
        while (i < n1) { if (forceStop) return; setBarDataFromValues(bars[k], L[i].value, L[i].height); i++; k++; await sleep(getSpeed()); }
        while (j < n2) { if (forceStop) return; setBarDataFromValues(bars[k], R[j].value, R[j].height); j++; k++; await sleep(getSpeed()); }
    }
    async function mergeSortRecursive(l, r) {
        if (l >= r || forceStop) return;
        const m = l + Math.floor((r - l) / 2);
        updateExplanation(`Dividing the array into two halves.`);
        await mergeSortRecursive(l, m);
        await mergeSortRecursive(m + 1, r);
        updateExplanation(`Conquering: Merging the sorted halves back together.`);
        await merge(l, m, r);
    }
    await mergeSortRecursive(0, bars.length - 1);
}

async function quickSort() {
    const bars = Array.from(document.getElementsByClassName('bar'));
    async function partition(low, high) {
        let pivot = getBarValue(bars[high]);
        setBarLabel(bars[high], 'pivot');
        setColor(bars[high], 'bar-pivot');
        updateExplanation(`Choosing ${pivot} as the pivot. Partitioning from index ${low} to ${high}.`);
        await sleep(getSpeed()); if (forceStop) return -1;
        let i = low - 1;
        for (let j = low; j < high; j++) {
            if (forceStop) return -1;
            setBarLabel(bars[j], 'j');
            setColor(bars[j], 'bar-comparing');
            updateExplanation(`Comparing element ${getBarValue(bars[j])} with pivot ${pivot}.`);
            await sleep(getSpeed()); if (forceStop) return -1;
            if (getBarValue(bars[j]) < pivot) {
                i++;
                setBarLabel(bars[i], 'i');
                updateExplanation(`${getBarValue(bars[j])} < ${pivot}. Swapping element at 'i' with element at 'j'.`);
                setColor(bars[i], 'bar-swapping'); setColor(bars[j], 'bar-swapping');
                await sleep(getSpeed()); if (forceStop) return -1;
                swap(bars[i], bars[j]);
                setColor(bars[i], 'bar-default');
                setBarLabel(bars[i], '');
            }
            setColor(bars[j], 'bar-default');
            setBarLabel(bars[j], '');
        }
        updateExplanation(`Placing pivot ${pivot} in its final sorted position.`);
        setColor(bars[i + 1], 'bar-swapping'); setColor(bars[high], 'bar-swapping');
        await sleep(getSpeed()); if (forceStop) return -1;
        swap(bars[i + 1], bars[high]);
        setColor(bars[high], 'bar-default');
        setBarLabel(bars[high], '');
        setColor(bars[i + 1], 'bar-sorted');
        return i + 1;
    }
    async function quickSortRecursive(low, high) {
        if (low < high && !forceStop) {
            let pi = await partition(low, high);
            if (pi === -1) return;
            await quickSortRecursive(low, pi - 1);
            await quickSortRecursive(pi + 1, high);
        }
    }
    await quickSortRecursive(0, bars.length - 1);
}

async function heapSort() {
    const bars = document.getElementsByClassName('bar');
    const n = bars.length;
    async function heapify(n_heap, i) {
        if (forceStop) return;
        let largest = i, l = 2 * i + 1, r = 2 * i + 2;
        if (l < n_heap && getBarValue(bars[l]) > getBarValue(bars[largest])) largest = l;
        if (r < n_heap && getBarValue(bars[r]) > getBarValue(bars[largest])) largest = r;
        if (largest != i) {
            updateExplanation(`Heapifying: Swapping ${getBarValue(bars[i])} and ${getBarValue(bars[largest])} to maintain heap property.`);
            setColor(bars[i], 'bar-swapping'); setColor(bars[largest], 'bar-swapping');
            await sleep(getSpeed()); if (forceStop) return;
            swap(bars[i], bars[largest]);
            setColor(bars[i], 'bar-default'); setColor(bars[largest], 'bar-default');
            await heapify(n_heap, largest);
        }
    }
    updateExplanation('Building a max heap from the array.');
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) await heapify(n, i);
    updateExplanation('Extracting elements one by one from the heap.');
    for (let i = n - 1; i > 0; i--) {
        if (forceStop) return;
        updateExplanation(`Swapping root ${getBarValue(bars[0])} with the last element ${getBarValue(bars[i])} of the heap.`);
        setColor(bars[0], 'bar-swapping'); setColor(bars[i], 'bar-swapping');
        await sleep(getSpeed()); if (forceStop) return;
        swap(bars[0], bars[i]);
        setColor(bars[i], 'bar-sorted');
        await heapify(i, 0);
    }
    if (n > 0) setColor(bars[0], 'bar-sorted');
}

async function cocktailShakerSort() {
    const bars = document.getElementsByClassName('bar');
    let n = bars.length, swapped = true, start = 0, end = n - 1;
    while (swapped) {
        if (forceStop) return;
        swapped = false;
        updateExplanation('Forward pass, bubbling the largest element to the right.');
        for (let i = start; i < end; ++i) {
            if (forceStop) return;
            setColor(bars[i], 'bar-comparing'); setColor(bars[i + 1], 'bar-comparing');
            await sleep(getSpeed()); if (forceStop) return;
            if (getBarValue(bars[i]) > getBarValue(bars[i + 1])) {
                swap(bars[i], bars[i + 1]); swapped = true;
            }
            setColor(bars[i], 'bar-default'); setColor(bars[i + 1], 'bar-default');
        }
        if (!swapped) break;
        swapped = false;
        setColor(bars[end], 'bar-sorted'); end--;
        updateExplanation('Backward pass, bubbling the smallest element to the left.');
        for (let i = end - 1; i >= start; --i) {
            if (forceStop) return;
            setColor(bars[i], 'bar-comparing'); setColor(bars[i + 1], 'bar-comparing');
            await sleep(getSpeed()); if (forceStop) return;
            if (getBarValue(bars[i]) > getBarValue(bars[i + 1])) {
                swap(bars[i], bars[i + 1]); swapped = true;
            }
            setColor(bars[i], 'bar-default'); setColor(bars[i + 1], 'bar-default');
        }
        setColor(bars[start], 'bar-sorted'); start++;
    }
}

async function gnomeSort() {
    const bars = document.getElementsByClassName('bar');
    let index = 0;
    updateExplanation('Starting Gnome Sort...');
    while (index < bars.length) {
        if (forceStop) return;
        if (index == 0) index++;
        if (index >= bars.length) break;
        setColor(bars[index], 'bar-comparing'); if (index > 0) setColor(bars[index-1], 'bar-comparing');
        await sleep(getSpeed()); if (forceStop) return;
        if (getBarValue(bars[index]) >= getBarValue(bars[index - 1])) {
            updateExplanation(`Element ${getBarValue(bars[index])} is in correct order. Moving forward.`);
            if (index > 0) setColor(bars[index-1], 'bar-default');
            setColor(bars[index], 'bar-default');
            index++;
        } else {
            updateExplanation(`Element ${getBarValue(bars[index])} is smaller. Swapping and moving backward.`);
            swap(bars[index], bars[index - 1]);
            if (index > 0) setColor(bars[index-1], 'bar-default');
            setColor(bars[index], 'bar-default');
            index--;
        }
    }
}

async function oddEvenSort() {
    const bars = document.getElementsByClassName('bar');
    let sorted = false;
    while (!sorted) {
        if (forceStop) return;
        sorted = true;
        updateExplanation('Comparing and swapping odd-indexed elements.');
        for (let i = 1; i <= bars.length - 2; i += 2) {
            if (forceStop) return;
            setColor(bars[i], 'bar-comparing'); setColor(bars[i + 1], 'bar-comparing');
            await sleep(getSpeed()); if (forceStop) return;
            if (getBarValue(bars[i]) > getBarValue(bars[i + 1])) {
                swap(bars[i], bars[i + 1]); sorted = false;
            }
            setColor(bars[i], 'bar-default'); setColor(bars[i + 1], 'bar-default');
        }
        updateExplanation('Comparing and swapping even-indexed elements.');
        for (let i = 0; i <= bars.length - 2; i += 2) {
            if (forceStop) return;
            setColor(bars[i], 'bar-comparing'); setColor(bars[i + 1], 'bar-comparing');
            await sleep(getSpeed()); if (forceStop) return;
            if (getBarValue(bars[i]) > getBarValue(bars[i + 1])) {
                swap(bars[i], bars[i + 1]); sorted = false;
            }
            setColor(bars[i], 'bar-default'); setColor(bars[i + 1], 'bar-default');
        }
    }
}

async function countingSort() {
    updateExplanation("Counting occurrences of each number...");
    const bars = document.getElementsByClassName('bar');
    const max = Math.max(...array);
    const count = Array(max + 1).fill(0);
    for (let i = 0; i < array.length; i++) {
        if (forceStop) return;
        setColor(bars[i], 'bar-comparing');
        await sleep(getSpeed()); if (forceStop) return;
        count[getBarValue(bars[i])]++;
        setColor(bars[i], 'bar-default');
    }
    updateExplanation("Rebuilding the array from the counts...");
    let sortedIndex = 0;
    for (let i = 0; i < count.length; i++) {
        while (count[i] > 0) {
            if (forceStop) return;
            array[sortedIndex] = i;
            count[i]--;
            sortedIndex++;
        }
    }
    await updateAllBars(array);
}

async function radixSort() {
    let max = Math.max(...array);
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
        if (forceStop) return;
        updateExplanation(`Sorting based on digit at position ${exp}...`);
        await sleep(getSpeed()); if (forceStop) return;
        await countingSortForRadix(exp);
    }
}

async function countingSortForRadix(exp) {
    const bars = document.getElementsByClassName('bar');
    const n = array.length;
    let output = new Array(n);
    let count = new Array(10).fill(0);
    for (let i = 0; i < n; i++) count[Math.floor(getBarValue(bars[i]) / exp) % 10]++;
    for (let i = 1; i < 10; i++) count[i] += count[i - 1];
    for (let i = n - 1; i >= 0; i--) {
        output[count[Math.floor(getBarValue(bars[i]) / exp) % 10] - 1] = getBarValue(bars[i]);
        count[Math.floor(getBarValue(bars[i]) / exp) % 10]--;
    }
    array = output;
    await updateAllBars(array);
}

async function bucketSort() {
    const n = array.length;
    if (n <= 0) return;
    updateExplanation("Creating buckets...");
    let buckets = new Array(n);
    for (let i = 0; i < n; i++) buckets[i] = [];
    await sleep(getSpeed()); if (forceStop) return;
    updateExplanation("Distributing elements into buckets...");
    for (let i = 0; i < n; i++) {
        if (forceStop) return;
        let bucketIndex = Math.floor(array[i] * n / 101);
        buckets[bucketIndex].push(array[i]);
    }
    await sleep(getSpeed()); if (forceStop) return;
    updateExplanation("Sorting individual buckets...");
    for (let i = 0; i < n; i++) buckets[i].sort((a, b) => a - b);
    await sleep(getSpeed()); if (forceStop) return;
    updateExplanation("Concatenating buckets...");
    let index = 0;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < buckets[i].length; j++) {
            if (forceStop) return;
            array[index++] = buckets[i][j];
        }
    }
    await updateAllBars(array);
}

async function shellSort() {
    const bars = document.getElementsByClassName('bar');
    const n = bars.length;
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        if (forceStop) return;
        updateExplanation(`Sorting with gap size ${gap}...`);
        for (let i = gap; i < n; i += 1) {
            if (forceStop) return;
            let tempVal = getBarValue(bars[i]);
            let tempHeight = bars[i].style.height;
            let j;
            for (j = i; j >= gap && getBarValue(bars[j - gap]) > tempVal; j -= gap) {
                if (forceStop) return;
                setColor(bars[j], 'bar-comparing'); setColor(bars[j-gap], 'bar-comparing');
                await sleep(getSpeed()); if (forceStop) return;
                setBarData(bars[j], bars[j - gap]);
                setColor(bars[j], 'bar-default'); setColor(bars[j-gap], 'bar-default');
            }
            setBarDataFromValues(bars[j], tempVal, tempHeight);
        }
    }
}

async function pancakeSort() {
    const bars = document.getElementsByClassName('bar');
    for (let curr_size = bars.length; curr_size > 1; --curr_size) {
        if (forceStop) return;
        let max_idx = 0;
        updateExplanation(`Finding the largest pancake in the unsorted stack (size ${curr_size}).`);
        for (let i = 1; i < curr_size; ++i) {
            if (forceStop) return;
            setColor(bars[i], 'bar-comparing'); setColor(bars[max_idx], 'bar-pivot');
            await sleep(getSpeed()); if (forceStop) return;
            if (getBarValue(bars[i]) > getBarValue(bars[max_idx])) max_idx = i;
            setColor(bars[i], 'bar-default'); setColor(bars[max_idx], 'bar-default');
        }
        if (max_idx != curr_size - 1) {
            updateExplanation(`Largest pancake is at index ${max_idx}. Flipping to bring it to the front.`);
            await flip(bars, max_idx + 1);
            updateExplanation(`Flipping the stack to move the largest pancake to its correct position.`);
            await flip(bars, curr_size);
        }
        setColor(bars[curr_size-1], 'bar-sorted');
    }
}

async function flip(bars, k) {
    let l = 0;
    while (l < k) {
        if (forceStop) return;
        setColor(bars[l], 'bar-swapping'); setColor(bars[k - 1], 'bar-swapping');
        await sleep(getSpeed()); if (forceStop) return;
        swap(bars[l], bars[k - 1]);
        setColor(bars[l], 'bar-default'); setColor(bars[k - 1], 'bar-default');
        l++; k--;
    }
}

async function bogoSort() {
    const bars = document.getElementsByClassName('bar');
    let attempts = 0;
    const maxAttempts = 2000; 
    while (!isSorted(bars) && attempts < maxAttempts) {
        if (forceStop) return;
        attempts++;
        updateExplanation(`Attempt #${attempts}: Randomly shuffling the array...`);
        for (let i = bars.length - 1; i > 0; i--) {
            if (forceStop) return;
            const j = Math.floor(Math.random() * (i + 1));
            setColor(bars[i], 'bar-swapping'); setColor(bars[j], 'bar-swapping');
            await sleep(5); 
            swap(bars[i], bars[j]);
            setColor(bars[i], 'bar-default'); setColor(bars[j], 'bar-default');
        }
    }
    if (isSorted(bars)) {
        updateExplanation(`Sorted after ${attempts} attempts!`);
    } else {
        updateExplanation(`Giving up after ${maxAttempts} attempts.`);
    }
}

function isSorted(bars) {
    for (let i = 0; i < bars.length - 1; i++) {
        if (getBarValue(bars[i]) > getBarValue(bars[i + 1])) return false;
    }
    return true;
}
