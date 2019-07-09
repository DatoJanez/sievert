var ress, i, rows, mappedData
    
var parse_sivers_rec = (sieverts) => {
    count_s_values = 0
    aggr_sieverts = []
    sieverts.forEach(value => {
        if(count_s_values == 12){
            rows.push({date: new Date(ress.date[i]), sievert: aggr_sieverts});
            i++ 
            count_s_values = 0
            aggr_sieverts = []
        }
        aggr_sieverts.push(value[0])
        count_s_values ++
    })
}
var avarage = (data__) => {
    
    var avg_graph_data = []
    data__.forEach(line => {
        avg_single_int = {name: line.name, sieverts: []}
        var current_day_time = line.sieverts[0].date
        var count_values = 0
        var count_values_amount = 0  
        
        line.sieverts.forEach(val => {
            if(val.date.getMonth() == current_day_time.getMonth() & val.date.getDate() == current_day_time.getDate()){
                count_values ++
                count_values_amount += val.sievert
            } else {
                avg_single_int.sieverts.push({date:current_day_time, sievert: (count_values_amount / count_values) })
                count_values = 1
                current_day_time = val.date
                count_values_amount = val.sievert
            }
        })
        avg_graph_data.push(avg_single_int)
    })
    return avg_graph_data
}
var sievertTitles
var preccess_ress = (raw_ress) => {
    let data = raw_ress
    data.date = JSON.parse(data.date);
    // data.sentences = JSON.parse(data.sentences);
    data.sieverts = JSON.parse(data.sieverts);
    ress = data
    // data = ress
    i = 0
    rows = []
    sievert_csv = []
    parse_sivers_rec(data.sieverts)
    
    rows.sort((a, b) => a.date > b.date)
    sievertTitles = ['target', 'severe_toxicity', 'obscene', 'identity_attack', 'insult', 'threat', 'sexual_explicit', 'race', 'gender', 'orientation', 'religion', 'disability']
    // newData = [        { name: "a", values:[]},        { name: "b", values:[]},        { name: "c", values:[]},        { name: "d", values:[]},        { name: "e", values:[]},        { name: "f", values:[]},        { name: "g", values:[]},        { name: "g", values:[]},        { name: "i", values:[]},        { name: "j", values:[]},        { name: "k", values:[]} ]
    mappedData = []
    sievertTitles.forEach(sievertTitle => mappedData.push({ name: sievertTitle, sieverts: [] }));
    rows.forEach(row => {
        [...Array(12).keys()].forEach( index =>  mappedData[index].sieverts.push({date: new Date(row.date), sievert: (+row.sievert[index])}) )
        csv_value = {date: new Date(row.date)}
        sievertTitles.forEach(( sievertTitle, index) => csv_value[sievertTitle] = (+row.sievert[index]))
        sievert_csv.push(csv_value)
    })
    
    avg_date = avarage(mappedData)
    drow_chart(mappedData)
}
var fetch_sieverts = () => {
    document.getElementById('chart').innerHTML = ''
    fetch('https://207.154.252.11:5000/?sub-reddit='+document.getElementById('keyword').value)
        .then(response => response.json())
        .then(json_response => {
            db.open().then(() => db.sieverts.add({keyword: document.getElementById('keyword').value, value: json_response}))
            preccess_ress(json_response)
            initSavedSiverets()
        });
    // preccess_ress(sample_ress)
}
document.getElementsByTagName('button')[0].addEventListener('click', fetch_sieverts)