
var min = 0; max=1000; //RANDOM FLOAT
var maxim=25000000; //restriction of elements

function CheckPoint(n,o) ////checking the correspondence of the entered number
{
    if(n>min && n<maxim){
        let k = Number(n)
        return Complete(k,o);
    }
    else
        return Execution(n);
}
function Complete(n,o) //successfully
{   
    var Elem="Количество точек: " + n;
    alert(Elem);
    getArrayRandom(n,o);

}

function Execution(n) // unsuccessfully
{
    var Elem="Неверно введенны данные. Количество точек должно быть число от "+ min +" до " + maxim +". Вы ввели: " + n;
    alert(Elem);
    document.getElementById('Point').value="";
}

function getRadomFloat(min,max) // get random 
{
    return Math.random() *(max-min) +min;
}


function getGaus(n) // get random element 
{
    var rand=0;
    for (var i=0; i<n; i++)
    rand+= Math.random() *(max-min) +min;
    return rand/n;
}

function gaussianRand(min, max) // get random element 
{ 
    var rand=0;
    for (var i=0; i<2; i++)
    rand+= (Math.random() *(max-min));
    return rand/2;
}


function getCicrcle(min, max){ // get random element 
    var rand=0;
    for (var i=0; i<6; i++)
    rand+= (Math.random() *(max-min)-min);
    return rand/6;
}

function getArrayRandom(n,o) //creating an array
{
    var f=0;
    var z;
    var z1;
    var arrX = [];
    var arrY = [];
    for (var i=0; i<n; i++) {
        if(o==0)
        {
        arrY.push(getRadomFloat(0,max));
        arrX.push(getRadomFloat(0,max));
        }
        else if (o==1)
        {
        arrY.push(gaussianRand(0,max));
        arrX.push(gaussianRand(0,max));
        }
        else if (o==2)
        {   while(f==0){
                z=getRadomFloat(-500,500);
                z1=getRadomFloat(-500,500);
                if(Math.sqrt(Math.pow(z,2)+Math.pow(z1,2))<=490)
                f=1;
            }
            arrY.push(z+500);
            arrX.push(z1+500);
            f=0;
        }

    }

    GoDraw(arrX,arrY,n);
}


function GoDraw(X,Y,n) //draw on canvas
{
    var f=true;
    //initialization
    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');
   
    //clear canvas
    context.clearRect(0, 0, max, max);
    context.beginPath();
    
    holst(X,Y,n, context); //need this function because we need clear canvas when draw new rect
    
    
    let points = [];
    for (let i = 0; i < n; i++) {
        points.push([X[i], Y[i]]);
    }

    var time = performance.now(); //timer start
    let Kxem = grahamScan(points);
    time = performance.now() - time;//timer stop

  
    var time1 = performance.now(); //timer start
    let jrv = jarvisMarch(points);
    time1 = performance.now() - time1;//timer stop

    colorname = "red";
    drawLine(jrv, colorname, 5);
    console.log(jrv);

    var Elem = 'Джарвис: ' + time;
    //passing value
    document.getElementById('times1').value = Elem;

    var colorname = "blue";
    drawLine(Kxem , colorname, 2);
    console.log(Kxem);

    var Elem1 = 'Грехэм: ' + time1;
    //passing value
    document.getElementById('times2').value = Elem1;



    function drawLine(rect, colorname, linew)
    {
        //draw rect
        //context.clearRect(0, 0, max, max);
        //context.beginPath();
        //holst(X,Y, n, context);
        //line option
        context.strokeStyle = colorname;
        context.lineWidth = linew;
        let k1=0;
        k=rect.length
        context.moveTo(rect[0][0], rect[0][1]); //line start
        while (k1<k-1){
        context.lineTo(rect[k1][0], rect[k1][1]); //line start
        context.lineTo(rect[k1+1][0], rect[k1+1][1]); //line end
        k1=k1+2;
        }
        context.lineTo(rect[k-1][0], rect[k-1][1]); 
        context.lineTo(rect[0][0], rect[0][1]); 
        context.stroke();
    }

}
    

function holst(X,Y, n, context){ //new holst
    //line option
    context.lineWidth = 20;
    context.strokeStyle = "red";
    //line x
    context.beginPath();
    context.moveTo(0,0);
    context.lineTo(0,max);
    context.lineCap = "round";
    context.stroke();
    //line y
    context.beginPath();
    context.moveTo(0,max);
    context.lineTo(max,max);
    context.lineCap = "round";
    context.stroke();

    //line option
    context.lineWidth = 8;
    context.strokeStyle = "black";
    //drawing an array
    for(var i=0;i<n; i++)
    {
        context.beginPath();
        //context.lineTo(X[i],Y[i]); //for chrom and other
        //context.moveTo(X[i],Y[i]);
        context.arc(X[i], Y[i], 1, 0, Math.PI*2); //for safari and everyone
        context.lineCap = "round";
        context.stroke();
    }
} 



function orientation(p, q, r) {
    let val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);
    if (val == 0) return 0; // collinear
    return (val > 0) ? 1 : 2; // clock or counterclock wise
}

function jarvisMarch(points) {
    var n=points.length
    if (n < 3) return []; // need at least 3 points for a convex hull

    let leftMost = 0;
    for (let i = 1; i < n; i++) {
        if (points[i][0] < points[leftMost][0]) {
            leftMost = i;
        }
    }

    let hull = [];
    let p = leftMost;
    let q;

    do {
        hull.push(points[p]);
        q = (p + 1) % n;

        for (let i = 0; i < n; i++) {
            if (orientation(points[p], points[i], points[q]) == 2) {
                q = i;
            }
        }

        p = q;
    } while (p !== leftMost);

    return hull;
}



function grahamScan(points) {
    var n=points.length
    if (n < 3) return []; // need at least 3 points for a convex hull

    points.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

    let hull = [];

    // Lower hull
    for (let i = 0; i < n; i++) {
        while (hull.length >= 2 && orientation(hull[hull.length - 2], hull[hull.length - 1], points[i]) != 2) {
            hull.pop();
        }
        hull.push(points[i]);
    }

    // Upper hull
    for (let i = n - 2, t = hull.length + 1; i >= 0; i--) {
        while (hull.length >= t && orientation(hull[hull.length - 2], hull[hull.length - 1], points[i]) != 2) {
            hull.pop();
        }
        hull.push(points[i]);
    }

    hull.pop(); // Remove last point (duplicate of first point)

    return hull;
}


	