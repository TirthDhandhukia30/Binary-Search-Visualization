document.addEventListener("DOMContentLoaded", () => {
  feather.replace();
  AOS.init();

  let array = [];
  let target = null;
  let low = 0, high = 0, mid = 0;
  let speed = 1500;
  let searchInterval = null;

  const arraySizeInput = document.getElementById("arraySize");
  const targetValueInput = document.getElementById("targetValue");
  const generateArrayBtn = document.getElementById("generateArray");
  const startSearchBtn = document.getElementById("startSearch");
  const arrayContainer = document.getElementById("arrayContainer");
  const statusText = document.getElementById("statusText");

  function generateArray() {
    stopSearch();
    const size = parseInt(arraySizeInput.value);
    array = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
    array.sort((a, b) => a - b);
    renderArray();
    statusText.textContent =
      `Generated sorted array of ${size} elements. Enter a target value (1-100) to search.`;
  }

  function renderArray(lowIdx = null, highIdx = null, midIdx = null, foundIdx = null) {
    arrayContainer.innerHTML = "";
    array.forEach((value, index) => {
      const el = document.createElement("div");
      el.className =
        "array-element flex flex-col items-center justify-center w-12 h-20 transition-all duration-300";

      const val = document.createElement("span");
      val.className = "font-bold";
      val.textContent = value;

      const idx = document.createElement("span");
      idx.className = "text-xs mt-1";
      idx.textContent = index;

      el.appendChild(val);
      el.appendChild(idx);

      if (foundIdx !== null && index === foundIdx) el.classList.add("checked-element");
      else if (index === midIdx) el.classList.add("current-element");
      else if (
        (lowIdx !== null && index < lowIdx) ||
        (highIdx !== null && index > highIdx)
      ) el.classList.add("disabled-element");
      else if (midIdx !== null && (index === lowIdx || index === highIdx))
        el.classList.add("searched-element");

      arrayContainer.appendChild(el);
    });
  }

  function binarySearchStep() {
    if (low > high) {
      statusText.textContent = `Target ${target} not found in the array.`;
      stopSearch();
      return;
    }

    mid = Math.floor((low + high) / 2);
    renderArray(low, high, mid);

    if (array[mid] === target) {
      statusText.textContent = `Found target ${target} at index ${mid}!`;
      renderArray(low, high, mid, mid);
      stopSearch();
    } else if (array[mid] < target) {
      statusText.textContent = `Target ${target} > ${array[mid]} at index ${mid}. Searching right half.`;
      low = mid + 1;
    } else {
      statusText.textContent = `Target ${target} < ${array[mid]} at index ${mid}. Searching left half.`;
      high = mid - 1;
    }
  }

  function startBinarySearch() {
    const tVal = parseInt(targetValueInput.value);
    if (isNaN(tVal)) {
      statusText.textContent = "Please enter a valid target value.";
      return;
    }
    if (array.length === 0) {
      statusText.textContent = "Please generate an array first.";
      return;
    }

    target = tVal;
    low = 0;
    high = array.length - 1;
    startSearchBtn.disabled = true;
    statusText.textContent = `Starting binary search for target ${target}...`;

    searchInterval = setInterval(binarySearchStep, speed);
  }

  function stopSearch() {
    clearInterval(searchInterval);
    startSearchBtn.disabled = false;
  }

  generateArrayBtn.addEventListener("click", generateArray);
  startSearchBtn.addEventListener("click", startBinarySearch);

  // initial array
  generateArray();
});
