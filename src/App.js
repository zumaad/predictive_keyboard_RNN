import React, {Component} from 'react';
const tf = require('@tensorflow/tfjs');
let model = ""

const shakespeareChars = ['\n', " ", '!', '$', '&', "'", ',', '-', '.', '3', ':', ';',
    '?', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
    'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
    'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w',
    'x', 'y', 'z']

const shakespearechar2idx = {'\n': 0, ' ': 1, '!': 2, '$': 3, '&': 4, "'": 5, ',': 6, '-': 7, '.': 8,
    '3': 9, ':': 10, ';': 11, '?': 12, 'A': 13, 'B': 14, 'C': 15, 'D': 16, 'E': 17, 'F': 18,
    'G': 19, 'H': 20, 'I': 21, 'J': 22, 'K': 23, 'L': 24, 'M': 25, 'N': 26, 'O': 27, 'P': 28,
    'Q': 29, 'R': 30, 'S': 31, 'T': 32, 'U': 33, 'V': 34, 'W': 35, 'X': 36, 'Y': 37, 'Z': 38,
    'a': 39, 'b': 40, 'c': 41, 'd': 42, 'e': 43, 'f': 44, 'g': 45, 'h': 46, 'i': 47, 'j': 48,
    'k': 49, 'l': 50, 'm': 51, 'n': 52, 'o': 53, 'p': 54, 'q': 55, 'r': 56, 's': 57, 't': 58,
    'u': 59, 'v': 60, 'w': 61, 'x': 62, 'y': 63, 'z': 64}

const trumpChars = ['\n', ' ', '!', '"', '#', '$', '%', "'", '(', ')', '+', ',', '-', '.', '/', '0', '1', '2',
    '3', '4', '5', '6', '7', '8', '9', ':', ';', '?', '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G',
    'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y',
    'Z', '_', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
    'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '|', '–', '—', '‘', '’', '“', '”', '…']
const trumpchar2idx = {'\n': 0, ' ': 1, '!': 2, '"': 3, '#': 4, '$': 5, '%': 6, "'": 7, '(':
        8, ')': 9, '+': 10, ',': 11, '-': 12, '.': 13, '/': 14,
    '0': 15, '1': 16, '2': 17, '3': 18, '4': 19, '5': 20, '6': 21,
    '7': 22, '8': 23, '9': 24, ':': 25, ';': 26, '?': 27, '@': 28,
    'A': 29, 'B': 30, 'C': 31, 'D': 32, 'E': 33, 'F': 34, 'G': 35,
    'H': 36, 'I': 37, 'J': 38, 'K': 39, 'L': 40, 'M': 41, 'N': 42,
    'O': 43, 'P': 44, 'Q': 45, 'R': 46, 'S': 47, 'T': 48, 'U': 49,
    'V': 50, 'W': 51, 'X': 52, 'Y': 53, 'Z': 54, '_': 55, 'a': 56,
    'b': 57, 'c': 58, 'd': 59, 'e': 60, 'f': 61, 'g': 62, 'h': 63,
    'i': 64, 'j': 65, 'k': 66, 'l': 67, 'm': 68, 'n': 69, 'o': 70,
    'p': 71, 'q': 72, 'r': 73, 's': 74, 't': 75, 'u': 76, 'v': 77,
    'w': 78, 'x': 79, 'y': 80, 'z': 81, '|': 82, '–': 83, '—': 84,
    '‘': 85, '’': 86, '“': 87, '”': 88, '…': 89}

let mappings = {'Shakespeare':[shakespeareChars,shakespearechar2idx],'Trump':[trumpChars,trumpchar2idx]}




const textBoxStyle = {
    width:'80%',
    border: '2px solid gray',
    height: '200px',
    marginRight: '10%',
    marginLeft: '10%',
    marginTop: '3%',
    overflow: 'scroll'

}

const potentialWordBoxStyle = {
    border: '1px solid gray',
    marginRight: '10%',
    marginLeft: '10%',
    height :'40px',
    background:'#D0D0D0'


}

const columnStyle = {
    textAlign:'center',
    border: '1px solid black'
}

const selectedColumnStyle = {
    textAlign:'center',
    border: '1px solid black',
    background: 'white'
}

const wordStyle = {
    marginTop: '3%'
}

const keyBindings = {
    'select':'Control',
    'move':'Shift'
}

const paths =  {'Shakespeare':'http://0.0.0.0:8000/second_js_model/model.json','Trump':'http://0.0.0.0:8000/trump_model/model.json'}
class TextBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentText: '',
            potentialWords: [['go',0],['here',1],['when',2]],
            currIndex:-1,
            inputBoxText:'',
            numChars:0,
            temperature:.01,
            title: "Shakespeare",
            model: this.loadModel(paths['Shakespeare'])


        }
        this.loadModel = this.loadModel.bind(this);
        this.trackCurrentText = this.trackCurrentText.bind(this);
        this.handleKey = this.handleKey.bind(this);
        this.displaySuggestion = this.displaySuggestion.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.predictWords = this.predictWords.bind(this);
        this.generateWords = this.generateWords.bind(this);

    }

    predictWords(input) {
        let temperature = parseFloat(this.state.temperature)
        let suggestWordList =[]
        let inputArray = input.split('')
        let inputVector = inputArray.map((char) => mappings[this.state.title][1][char])
        for (let i=0;i<3;i++){
            let builtWord =""
            let expandedWordVector = tf.expandDims(inputVector,0)
            while (true) {
                let predictionProbabilities = this.state.model.predict(expandedWordVector)
                predictionProbabilities = tf.squeeze(predictionProbabilities,0)
                predictionProbabilities = tf.div(predictionProbabilities,temperature)
                let predictedCharId = tf.multinomial(predictionProbabilities,1).dataSync()
                predictedCharId = predictedCharId[predictedCharId.length-1]
                expandedWordVector = tf.expandDims([predictedCharId],0)
                let predictedChar = mappings[this.state.title][0][predictedCharId]
                builtWord+=predictedChar
                // if (predictedChar !== chars[0]) {
                //     builtWord+=predictedChar
                // }
                if (predictedChar === ' ') {
                    suggestWordList.push(builtWord)
                    break
                }

            }
        }
        this.updateSuggestions(suggestWordList)



    }

    async loadModel(path) {
        model = await tf.loadLayersModel(path)
        this.setState({model:model})
    }

    trackCurrentText(event) {
        this.predictWords(event.target.value)
        this.setState({currentText: event.target.value});
    }

    handleKey(event) {
        if (event.key === keyBindings['move']) {
            this.setState({currIndex: (this.state.currIndex + 1) % this.state.potentialWords.length})
        }

        if ((event.key === keyBindings['select']) && (this.state.currIndex > -1)) {
            let pickedWord = this.state.potentialWords[this.state.currIndex][0]
            this.setState({currentText: this.state.currentText + pickedWord,
                                 currIndex:-1},() => this.predictWords(this.state.currentText))
        }
    }

    displaySuggestion(word) {
        let styling = columnStyle
        if (word[1] === this.state.currIndex) {
            styling = selectedColumnStyle
        }
        return(
            <div onClick={() => this.handleClick(word[0])} style = {styling} className='col'>
                <div style = {wordStyle}>
                    {word[0]}
                </div>
            </div>
        )
    }

    handleClick(word) {
        this.setState({currentText:this.state.currentText + word},() => this.predictWords(this.state.currentText))
        document.getElementById("editor").focus()

    }

    updateSuggestions(suggestionList) {
        let count = 0
        let newSuggestionList = suggestionList.map((word) => [word,count++])
        this.setState({potentialWords:newSuggestionList})
    }

    generateWords(inputText,num) {
        let temperature = parseFloat(this.state.temperature)
        let text_generated = []
        let inputArray = inputText.split('')
        let inputVector = inputArray.map((char) => mappings[this.state.title][1][char])
        let expandedWordVector = tf.expandDims(inputVector,0)
        for (let i =0;i<num;i++) {
            let predictions = model.predict(expandedWordVector)
            predictions = tf.squeeze(predictions, 0)
            predictions = tf.div(predictions,temperature)
            let predicted_id_list = tf.multinomial(predictions, 1).dataSync()
            let predicted_id = predicted_id_list[predicted_id_list.length -1]
            expandedWordVector = tf.expandDims([predicted_id], 0)
            text_generated.push(mappings[this.state.title][0][predicted_id])
        }
        this.setState({generatedText:inputText + text_generated.join('')})


    }

    render() {
        return (
            <div>
                <div style={{textAlign:'center'}}>
                    <select onChange={(event) => this.setState({title:event.target.value,model:this.loadModel(paths[event.target.value])})} style={{marginTop:'2%'}}>
                        <option> Shakespeare </option>
                        <option> Trump </option>
                        <option> Eminem </option>
                        <option> Country</option>
                    </select>
                    <h3 style={{marginTop:'2%'}}> You are currently on {this.state.title} mode</h3>
                    <hr></hr>
                </div>

                <div tabIndex="0" onKeyDown={this.handleKey}>

                    <div style={{textAlign:'center'}}>
                        <p>Temperature value: {this.state.temperature}</p>
                        <input type="range" min="0.0" max = "1.0" step = '.01' value={this.state.temperature} onChange={(e) => this.setState({temperature:e.target.value})} />
                    </div>

                    <textarea  id = "editor" style={textBoxStyle} onChange={this.trackCurrentText} value={this.state.currentText}> </textarea>

                    <div style = {potentialWordBoxStyle} className='row'>
                        {this.state.potentialWords.map(this.displaySuggestion)}
                    </div>

                </div>

                <div style = {{textAlign:'center',marginTop:'3%'}}>
                    <hr></hr>
                    <p> Generate Text!</p>
                    <input onChange={(e)=> this.setState({inputBoxText:e.target.value})} style={{width:'300px'}} placeholder={"Enter some text to start it off"}/>
                    <input placeholder={"# generated chars"} onChange={(e)=> this.setState({numChars:e.target.value})} type={"number"}/>
                    <button onClick={()=> this.generateWords(this.state.inputBoxText,this.state.numChars)}> Generate Text! </button>
                    <p style={{width:'350px',marginLeft:'35%'}}>
                        {this.state.generatedText}
                    </p>
                </div>
            </div>
        );
    }
}




export default TextBox;
