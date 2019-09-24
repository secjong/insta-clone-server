let people = [
    {
        id: "person1",
        name: "sejong",
        age: 22,
        gender: "male"
    },
    {
        id: "person2",
        name: "jonju",
        age: 26,
        gender: "female"
    },
    {
        id: "person3",
        name: "sojing",
        age: 15,
        gender: "male"
    },
    {
        id: "person4",
        name: "doyoong",
        age: 29,
        gender: "female"
    }
];

const getById = (id) => {
    return people.filter((item, index) => {
        return item.id === id;
    })[0];
}

const add = (name, age, gender) => {
    let person = {
        id: `person${people.length+1}`,
        name: name,
        age: age,
        gender: gender
    };

    people.push(person);
    return person; 
}

const remove = (id) => {
    let filteredPeople = people.filter((item, index) => {
        return item.id !== id;
    });

    if(filteredPeople.length < people.length){
        people = filteredPeople; 
        return true;
    } else {
        return false;
    }
};

export { people, getById, add, remove };