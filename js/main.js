(() => {
  const todayDate = new Date()

  const sortBtns = document.querySelectorAll('.sort-btn');
  const sortNames = document.getElementById('sortNames');
  const sortFaculties = document.getElementById('sortFaculties');
  const sortBirthdays = document.getElementById('sortBirthdays');
  const sortYears = document.getElementById('sortYears');

  const filters = document.querySelectorAll('.filter');
  const filterName = document.getElementById('filterName');
  const filterFaculty = document.getElementById('filterFaculty');
  const filterStartYear = document.getElementById('filterStartyear');
  const filterEndYear = document.getElementById('filterEndyear');
  const filterReset = document.getElementById('filterReset');

  const addForm = document.getElementById('add-form');
  const birthDate = document.getElementById('birthdate');
  const startYear = document.getElementById('start-year');
  const container = document.getElementById('container');
  const localStorageKey = 'students';
  let students = [];
  
  let filtered = [];
  let sorted = [];
  let isSorted = false;

  function normalizeDate(dateObj) {
    let year = dateObj.getFullYear();
    let month = (() => {
      if (dateObj.getMonth() + 1 <= 9) {
        return '0' + (dateObj.getMonth() + 1);
      }
      return dateObj.getMonth() + 1;
    })();
    let day = (() => {
      if (dateObj.getDate() <= 9) {
        return '0' + dateObj.getDate();
      }
      return dateObj.getDate();
    })();
    return {
        year,
        month,
        day
    };
  }

  function checkStrValue(inputElem) {
    if (inputElem.value.trim()
      && inputElem.value.trim().length >= 2
      && isNaN(inputElem.value)) {
        inputElem.previousElementSibling.classList.add('d-none');
        return normalizeStr(inputElem.value);
    } else {
      inputElem.previousElementSibling.classList.remove('d-none');
      return null;
    }
  }

  function normalizeStr(str) {
    let chars = str.trim().toLowerCase().split('');
    return chars.splice(0, 1).join('').toUpperCase() + chars.join('');
  }

  function createTableBody(container, data) {
    //очищаем контейнер
    container.innerHTML = '';

    let rows = [];

    for (let item of data) {
      let wrapper = document.createElement('tr');
      let name = document.createElement('td');
      let faculty = document.createElement('td');
      let birthdate = document.createElement('td');
      let period = document.createElement('td');
      let age = document.createElement('span');
      let stage = document.createElement('span');

      name.textContent = item.surname + ' ' + item.name + ' ' + item.middleName;
      faculty.textContent = item.faculty;
      faculty.classList.add('text-wrap');
      birthdate.textContent = `${item.birthDate.day}.${item.birthDate.month}.${item.birthDate.year}`;
      age = (() => {
        if (item.birthDate.month > normalizeDate(todayDate).month || (item.birthDate.month === normalizeDate(todayDate).month && item.birthDate.day > normalizeDate(todayDate).day)) {
          return ` (${Number(normalizeDate(todayDate).year) - Number(item.birthDate.year) - 1} лет)`;
        } else {
          return ` (${Number(normalizeDate(todayDate).year) - Number(item.birthDate.year)} лет)`;
        }
      })();
      period.textContent = `${item.startYear} - ${item.startYear + 4}`;
      stage.textContent = (() => {
        if (normalizeDate(todayDate).year > (item.startYear + 4) || (normalizeDate(todayDate).year === (item.startYear + 4) && Number(normalizeDate(todayDate).month) >= 9)) {
          return ' (Закончил)';
        } else if (normalizeDate(todayDate).year === item.startYear) {
            return ' (1 курс)';
        } else {
          return Number(normalizeDate(todayDate).month) > 9
          ? ` (${normalizeDate(todayDate).year - item.startYear + 1} курс)`
          : ` (${normalizeDate(todayDate).year - item.startYear} курс)`;
        }
      })();

      birthdate.append(age);
      period.append(stage);
      wrapper.append(name, faculty, birthdate, period);

      rows.push(wrapper);
    }
    for (let row of rows) {
      container.append(row);
    }
  }

  function getLocalData(key) {
    let data = JSON.parse(localStorage.getItem(key));
    return data ? data : [];
  }

  function updateLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  function toSort() {
    let sortedNames = [];
    let sortedFaculties = [];
    let sortedBirthdays = [];
    let sortedYears = [];

    if (filtered.length) {
      sorted = filtered;
    } else {
      sorted = students;
    }

    if (sortNames.classList.contains('active')) {
      let result = [];
      let studentsCopy = [];
      studentsCopy = studentsCopy.concat(students);

      for (const student of sorted) {
        sortedNames.push(student.surname + ' ' + student.name + ' ' + student.middleName);
      }
      sortedNames.sort();
      for (let name of sortedNames) {
        result.push(studentsCopy.splice(studentsCopy.findIndex(student => (student.surname + ' ' + student.name + ' ' + student.middleName) === name), 1)[0]);
      }
      sorted = result;
      isSorted = true;
    }
    if (sortFaculties.classList.contains('active')) {
      let result = [];
      let studentsCopy = [];
      studentsCopy = studentsCopy.concat(students);

      for (const student of sorted) {
        sortedFaculties.push(student.faculty);
      }
      sortedFaculties.sort();
      for (let faculty of sortedFaculties) {
        result.push(studentsCopy.splice(studentsCopy.findIndex(student => student.faculty === faculty), 1)[0]);
      }
      students = getLocalData(localStorageKey);
      sorted = result;
      isSorted = true;
    }
    if (sortBirthdays.classList.contains('active')) {
      let result = [];
      let studentsCopy = [];
      studentsCopy = studentsCopy.concat(students);

      for (const student of sorted) {
        sortedBirthdays.push(student.birthDate.year + '' + student.birthDate.month + '' + student.birthDate.day);
      }
      sortedBirthdays.sort();
      for (let birthday of sortedBirthdays) {
        result.push(studentsCopy.splice(studentsCopy.findIndex(student => student.birthDate.year + '' + student.birthDate.month + '' + student.birthDate.day === birthday), 1)[0]);
      }
      students = getLocalData(localStorageKey);
      sorted = result;
      isSorted = true;
    }
    if (sortYears.classList.contains('active')) {
      let result = [];
      let studentsCopy = [];
      studentsCopy = studentsCopy.concat(students);

      for (const student of sorted) {
        sortedYears.push(student.startYear);
      }
      sortedYears.sort((a, b) => a - b);
      for (let year of sortedYears) {
        result.push(studentsCopy.splice(studentsCopy.findIndex(student => student.startYear === year), 1)[0]);
      }
      students = getLocalData(localStorageKey);
      sorted = result;
      isSorted = true;
    }
    students = getLocalData(localStorageKey);
    createTableBody(container, sorted);
  }

  document.addEventListener('DOMContentLoaded', () => {
    //Забираем данные из localStorage
    students = getLocalData(localStorageKey);
    createTableBody(container, students);

    //Устанавливаем ограничение сегодняшним числом
    birthDate.setAttribute('max', `${normalizeDate(todayDate).year}-${normalizeDate(todayDate).month}-${normalizeDate(todayDate).day}`);
    startYear.setAttribute('max', `${normalizeDate(todayDate).year}`);

    addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let student = {
        surname: checkStrValue(document.getElementById('surname')),
        name: checkStrValue(document.getElementById('name')),
        middleName: checkStrValue(document.getElementById('middle-name')),
        birthDate: (() => {
          if (birthDate.valueAsDate) {
            if (!birthDate.previousElementSibling.classList.contains('d-none')) {
              birthDate.previousElementSibling.classList.add('d-none');
            }
            return normalizeDate(birthDate.valueAsDate);
          } else {
            birthDate.previousElementSibling.classList.remove('d-none');
            return null;
          }
        })(),
        startYear: (() => {
          if  (startYear.value) {
            if (!startYear.previousElementSibling.classList.contains('d-none')) {
              startYear.previousElementSibling.classList.add('d-none');
            }
            return parseInt(startYear.value);
          }
          startYear.previousElementSibling.classList.remove('d-none');
          return null;
          })(),
        faculty: checkStrValue(document.getElementById('faculty')),
      };
      // проверяем, что все поля заполнены
      for (let key in student) {
        if (!student[key]) {
          return;
        }
      }
      students.push(student);
      updateLocalStorage(localStorageKey, students);
      createTableBody(container, students);

      // очищаем фильтры
      filtered = [];
      filters.forEach(elem => {
        elem.value = '';
      })

      //очищаем сортировку
      sorted = students;
      sortBtns.forEach(btn => {
        btn.classList.remove('active');
      });
    
      //очищаем поля формы
      document.getElementById('add-form').querySelectorAll('input').forEach((elem) => {
        elem.value = '';
      });
    });
    sorted = students;

    filters.forEach(elem => {
      elem.addEventListener('input', function() {
        const values = {
          name: filterName.value.toLowerCase().trim(),
          faculty: filterFaculty.value.toLowerCase().trim(),
          startYear: parseInt(filterStartYear.value.trim()),
          endYear: parseInt(filterEndYear.value.trim()),
        }

        if (isSorted) {
          filtered = sorted;
        } else {
          filtered = students;
        }
        if (!values.name && !values.faculty && !values.startYear && !values.endYear) {
          filtered = [];
          createTableBody(container, students);
        } else {
          if (values.name) {
            filtered = filtered.filter((student) => {
              const value = student.surname + ' ' + student.name + ' ' + student.middleName;
              return value.toLowerCase().includes(values.name);
            });
          }
          if (values.faculty) {
            filtered = filtered.filter(student => student.faculty.toLowerCase().includes(values.faculty));
          }
          if (values.startYear) {
            filtered = filtered.filter(student => student.startYear === parseInt(values.startYear));
          }
          if (values.endYear) {
            filtered = filtered.filter(student => student.startYear + 4 === parseInt(values.endYear));
          }
          createTableBody(container, filtered);
        }
      });
    });
    filterReset.addEventListener('click', () => {
      filtered = [];
      sortBtns.forEach(btn => {
        if (btn.classList.contains('active')) {
          isSorted = true;
          return;
        }
      });
      sorted = students;
      isSorted ? toSort() : createTableBody(container, students);

      filters.forEach(elem => {
        elem.value = '';
      }); 
    });
    
    sortBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        this.classList.toggle('active');
        toSort();
        sortBtns.forEach(btn => {
          if (btn.classList.contains('active')) {
            isSorted = true;
          }
        });
      });
    });
  });
})();
