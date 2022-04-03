const helper = require('./helper.js');
let csrf;
const handleDomo = (e) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;
    const coolPoints = e.target.querySelector('#domoCoolPoints').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    if (!name || !age || !coolPoints) {
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, {name, age, coolPoints, _csrf}, loadDomosFromServer);

    return false;
}

const removeDomo = (e) => {
   // const name = e.target.querySelector('#dName').value;
   // const age = e.target.querySelector('#dAge').value;
   // const coolPoints = e.target.querySelector('#dCoolPoints').value;
   // const _csrf = e.target.querySelector('#_csrf').value;


    helper.sendPost("/maker", {name: e.target.name, age: -1, coolPoints: -1, _csrf: csrf}, loadDomosFromServer);
}

const DomoForm = (props) => {
    csrf = props.csrf;
    return (
        <form id='domoForm' onSubmit={handleDomo} name='domoForm' action='/maker' method='POST' className='domoForm'>
            <label htmlFor="name">Name: </label>
            <input id='domoName' type="text" name='name' placeholder='Domo Name' />
            <div>
                <label htmlFor="coolPoints">Cool Points: </label>
                <input id='domoCoolPoints' type="number" min='0' name='coolPoints'/>
            </div>
            <div>
                <label htmlFor="age">Age: </label>
                <input id='domoAge' type="number" min='0' name='age'/>
            </div>



            <input id='_csrf' type="hidden" name='_csrf' value={props.csrf} />
            <input className='makeDomoSubmit' type="submit" value="Make Domo" />
        </form>
    );
}

const DomoList = (props) => {
    if (props.domos.length === 0) {
        return (
            <div className='domoList'>
                <h3 className='emptyDomo'>No Domos Yet!</h3>
            </div>
        );
    }
    const domoNodes = props.domos.map(domo => {
        return (
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className='domoFace' />
                <h3 id="dName" className='domoName'>Name: {domo.name} </h3>
                <h3 id="dAge" className='domoAge'>Age: {domo.age} </h3>
                <h3 id="dCoolPoints" className='domoCoolPoints'>Cool Points: {domo.coolPoints} </h3>
                <button className='domoDeleteButton' name={domo.name} onClick={removeDomo}>Delete</button>
            </div>
        );
    });

    return (
        <div className='domoList'>
            {domoNodes}
        </div>
    );
}

const loadDomosFromServer = async () => {
    const response = await fetch('/getDomos');
    const data = await response.json();

    ReactDOM.render(
        <DomoList domos={data.domos} />,
        document.getElementById('domos')
    );
}

const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    ReactDOM.render(
        <DomoForm csrf={data.csrfToken} />,
        document.getElementById('makeDomo')
    );

    ReactDOM.render(
        <DomoList domos={[]} />,
        document.getElementById('domos')
    );

    loadDomosFromServer();
}

window.onload = init;