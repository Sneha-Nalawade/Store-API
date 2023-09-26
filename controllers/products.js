//we'll first create two routes: one(static waala) for manually testing if our routes are working properly or not
// and 2nd will be the actual route for products

//since we'll be using mongoose functions, we're defining async methoda here
// const getAllProductsStatic = async (req, res) => {
//     res.status(200).json({msg: `Products testing route`});
// }

// const getAllProducts = async (req, res) => {
//     res.status(200).json({msg: `Products route`});
// }

//now that we have data inside our database, we can start applying different filters and functionalitites to the controllers:
const Product = require('../models/product');

//mongoose models provide the facility to use many different methods for filtering like find(), findOneAndDelete(), deleteMany() etc
//1) now if I want to add a functionality that enables the user to search for a items of the models having a certain single or set of values for one or more attributes w

const getAllProductsStatic = async (req, res) => {   //why didnt use next() here????! --doubt 
//    const products = await Product.find({});
//    const products = await Product.find({ featured: true})

//    const products = await Product.find({name: 'Lisa'});  //when we filter this way, only the objects having names exactly equal to 'Lisa' will be displayed as response...not others even if they've this as a part of their whole name...eg, Lisan
//    const products = await Product.find({name: 'Lisa', featured: true});
//    const products = await Product.find({name: {$regex:'a', options:'i'}});

//    const products = await Product.find({}).sort('name');
//    const products = await Product.find({}).sort(name -price);

    //   const products = await Product.find({}).sort('name').select('name price').limit(10).skip(2); //can use just limit, just skip or use both in the same req query..anyway is fine!
    
    const products = await Product.find({price: { $gt: 30 }}).sort('name').select('name price').limit(10).skip(2);

//  =>  Query Parameters :- inside any requesting URL, if there are any one or set of key-value pairs (connected with each other through a '&' and to the remaining URL by using a '?')...then they're known as query parameters
// eg, localhost:3000/api/v1/products?name=Lisa 
// to access the data in the query parameters, use req.query

//    res.status(200).json({ products });
   res.status(200).json({ products, nbHits: products.length});
}

const getAllProducts = async (req, res) => {
    // console.log(req.query);
    //   const products = await Product.find(req.query); //req.query gives out an object, and hence can be directly passed in with find()
      
    // const {featured} = req.query  //as we use this approach to access the stuff in req. query parameters, extra fields inside the query, which aren't even defined in the obj model, wont cause unwelcomed results like giving out an empty array (using the logic that there was no object having that field, hence no object satisfying the cond in query params... )
    // const {featured, company, name} = req.query;
    //the names inside {} on LHS need not be same as the ones in the url's query params, but should be same as their corresponding counterparts in the connected database
    //so, we can also use 'search' instead of 'name' -> const {featured, company, search} = req.query;
    // const {featured, company, name, sort} = req.query;
    // const {featured, company, name, sort, fields} = req.query;
       const {featured, company, name, sort, fields, numericFilters} = req.query;
    
    const queryObject = {}

    if(featured)  // ----doubt2 => if the query has the condn of featured=false, then it wont enter this if body, and hence no featured field in the queryObject will be initialized with any value(false, in this case).....so won't it fail incase query has featured=false???
    {
        queryObject.featured = featured==='true'? true: false
    }
    // console.log(queryObject);
    
    if(company)
    {
        queryObject.company = company;
    }

    if(name)
    {
        queryObject.name = {$regex:name, $options:'i'}; //options" 'i' ->case insensitive
    }

    if(numericFilters)
    {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$e',
            '<': '$lt',
            '<=': '$lte'
        }
        const regEx = /\b(<|>|>=|=|<|<=)\b/g  //this is a sample regular expression taken randomly
        //we'll have to replace the strings in the regular expression that is passed, and convert it into mongoose understandable expression
        let filters = numericFilters.replace(regEx, (match)=>`-${operatorMap[match]}-`) //here, user-friendly comparison symbols will be replaced with mongoose-understandable symbols
        const options = ['price', 'rating'];  //these are the properties that we want to comsider/allow for numeric filters...even if mentioned....others would be ignored/not taken
        filters = filters.split(',').forEach((item)=>{
        //   const [] = item.split('-') //this is why we added hyphens('-') while converting the numericFilters to mongoose understandable form
          const [field, operator, value] = item.split('-'); //these would be the 3 parts (in same order), that we'ld get once we split each item on basis of '-'
          if(options.includes(field))
          {
            queryObject[field] = { [operator]: Number(value)} //coz the above was only mere splitting on the basis of hyphen...but the operators present in string format remained in string(as were taken from req.query), and hence should be converted explicitly to numeric form before comparison
            //DOUBT 3/4 => incase of multiple such fields/multiple properties belonging to field...will the key:value pair get appended to the same field within queryObject object???    
        }
        })
    }
  
    // const products = await Product.find(queryObject);   //we did not use curly braces coz its itself an object right? (inside the parenthesis of find)
    //since we'll be adding a chain of many functions after find() (like sort etc), so the program should not just run find() and immediately return it once done, due to await, but should rather
    //keep adding the modifications to the response as the further methods like sort come after find...so intially we'll be using a let variable instead of const, and store the result of find in another variable,
    //and store the final result only in a const variable named products

    // inside postman and also the url, if sorting is to be applied on more than one properties, then these property names are separated by commas,
    //BUT inside the Node.js code for this (i.e. here), these are to be only separated by single spaces
    console.log(queryObject);
    let result = Product.find(queryObject)
    //sort
    if(sort)  //it sort exists i.e. if sort is passed with the query parameters in the request/url
    {
        // console.log(sort);
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList)
    }
    else
    {
        result = result.sort('createdAt');
    }

    if(fields)
    {
        const fieldsList = fields.split(',').join(' ')
        result = result.select(fieldsList);
    }

    console.log(queryObject)

    //Pagination ->
    const page = Number(req.query.page) || 1  //since everything passed in req.query is a string, we need to convert it to Number type
    //also, the const page value will be set to the page number specified in the url req query, and if not given/passed in there, then the defualt will be taken as 1 (the value after '||' logical OR)
    const limit = Number(req.query.limit) || 10
    const skip = (page-1) * limit

    result = result.skip(skip).limit(limit);

    const products = await result;    
    res.status(200).json({products, nbHits: products.length});

    // res.status(200).json({msg: `Products route!`});
}

module.exports = {getAllProductsStatic, getAllProducts};

//there are 2 ways to check the Query parameters in postman...one is by entering them directly in the URL, while the other is my using the checkboxes available below the url waala box (on the same screen/page)

//=> what if in the Query string params, we're gonna pass in some kind of value which does not match any values that we currently have in the model??
//see, if in query body of req url, a property is passed such that no such property is either defined in the model for that object or it is not present....then an empty array will be given out as response, since no object of that model has the requested property, and hence does not match to the query

//now, if the query parameters in the requested url are not all defined for the model or atleast not present in the model, then instead of passing the entire req.query part in the Models.find({}) method; a better approach would be to take only certain properties for consideration
//and out of all that is passed through the query params, and hence control beforehand, what properties and their values we'll be considering for filtering out the objects (products in this case), and displaying.

//go through MongoDB Query Operators:- 1)$regex -> which means not exactly same as the string passed, but should have that as a sub-part of it atleast
//2)$options -> if its value is assigned 'i', it means case-insensitive 

//1)filter 2)sort 3)select 4)limit, skip, pagination 5)numericFilters
//fields/select option :- to select the fields which shall be displayed for each object

//limit - the max number of entries allowed/displayed/listed per page
//skip - the first 'n' entries to be skipped
//skip and limit used in combination to apply proper pagination...so that whenever a particular page number is requested(through req url or otherwise), the correct page with the right entries id dsiplayed/returned
//if limit not specified, a default number of entries/objects are displayed on a page

//all of these above stated request parameters and also many more that are possible are spearated/connected by '&' symbol with each other

//Numeric Filters -> providing an option for user to search using certain number conditions. now, the thing here is that
// req.query gives out strings, so the parameter/s corresponding to numeric conditions/comparisons are also passes in as string and hence need to be coverted to Numeric-and-operator type before using, so that its understandable by the system
// we also need to convert the operators present as a part of the string to symbols identifiable by Mongoose...so that it can compare the required properties accordingly and display the desired result

//signs like '>','>=' etc are user-understandable/ user-friendly, but Mongoose understands stuff like '$gt', '$gte' etc instead; so we need to convert the req.query params accordingly