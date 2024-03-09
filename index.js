const express = require('express');
const app = express();
const multer = require('multer');
const fs = require('fs');
const upload = multer({ dest: 'uploads/' });
const hbs = require('hbs');
const path = require('path');



// Налаштування Handlebars як двіжок шаблонів
app.set('view engine', 'hbs'); // Встановлюємо двигун для рендерингу шаблонів hbs
app.set('views', path.join(__dirname, 'views')); // Встановлюємо каталог для зберігання шаблонів

// Реєстрація розширення файла збереженого як шаблон
hbs.registerPartials(__dirname + '/views');


app.get('/', (req, res) => {
  res.render('main', { title: 'Upload File' });
});

// Функція дял видалення файлу із директорії
const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('File deleted successfully');
  });
};




const extremums = (data) => {
  let total_max;
  let total_min;


  for(let i = 0; i<data.length; i++){
    if(i==0){
      total_max = data[i];
      total_min = data[i];
    }
    if(total_max < data[i]){
      total_max = data[i];
    }
    if(total_min > data[i]){
      total_min = data[i];
    }
  }
  return {total_max: total_max, total_min: total_min};
}


const increase_sequence = (data) => {
  let total_increase_sequence = [];
  let count_increase_sequnce = [];
  let result = [];
  for(let i=0; i<data.length; i++){
    count_increase_sequnce.push(data[i])
    if(data[i] > data[i+1]){
      total_increase_sequence.push(count_increase_sequnce);
      count_increase_sequnce = [];
    }
  }

  for(let i=0; i<total_increase_sequence.length; i++){
    if(result.length < total_increase_sequence[i].length){
      result = total_increase_sequence[i];
    }
  }
  return result
}

const decrease_sequence = (data) => {
  let total_deacrease_sequence = [];
  let count_deacrease_sequnce = [];
  let result = [];
  for(let i=0; i<data.length; i++){
    count_deacrease_sequnce.push(data[i])
    if(data[i] < data[i+1]){
      total_deacrease_sequence.push(count_deacrease_sequnce);
      count_deacrease_sequnce = [];
    }
  }
  for(let i=0; i<total_deacrease_sequence.length; i++){
    if(result.length < total_deacrease_sequence[i].length){
      result = total_deacrease_sequence[i];
    }
  }
  return result
}

const medianNumber = (data) => {
  const sortedNumbers = data.sort((a, b) => a - b);
  const middleIndex = Math.floor(sortedNumbers.length/2);
  let median;
  if(sortedNumbers.length % 2 === 0){
    median = (sortedNumbers[middleIndex - 1] + sortedNumbers[middleIndex]) / 2;
  }else{
    median = sortedNumbers[middleIndex];
  }
  return median;
}

const averageNumber = (data) => {
  const total_arr = data.reduce((acc, curr) => acc + curr, 0);
  let average = total_arr/data.length;
  return average;
}


app.post('/upload', upload.single('file'), (req, res) => {
  try{
    const filePath = req.file.path;
    const errors = [];
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error reading file');
        deleteFile(filePath);
        return;
      }
      if(!req.file || req.file.mimetype !== 'text/plain'){
        errors.push('Invalid file format. Please upload a text file (.txt).');
      }
      if(typeof data !== 'string'){
        errors.push("Data don't string in file");
      }

      if(errors > 0){
        res.status(400).json({ errors });
        console.log(errors)
        deleteFile(filePath);
        return;
      }

      // Перетворення вмісту текстового файлу на масив чисел із типом даних Number
      const numbers = data.split('\n').map(Number);



      const increase = increase_sequence(numbers);
      const decrease = decrease_sequence(numbers);
      const extr = extremums(numbers);
      const mediana = medianNumber(numbers);
      const average = averageNumber(numbers)

      res.status(200).json({ extremum: extr, sequences: {increase, decrease}, mediana: mediana, average: average });
      console.log('Data download succesful');
      deleteFile(filePath);
    });
    req.setTimeout(0);
  }catch(err){
    console.log("Something worong upon download file via POST request:", err)
  }

});

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});