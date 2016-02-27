// These are Global Variables that are used throughout the game
var friction = 1;
var maxSpeed = 100;
var minSpeed = 5;



/**
 * Gets the distance between the two objects
 * @param a Object with an x and a y
 * @param b Object with an x and a y
 * @return float distance of the two objects
 */
function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Gets the direction of a towards b
 * @param a Object with an x and a y
 * @param b Object with an x and a y
 * @return 
 */
function direction(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if(dist > 0) {
      return { x: dx / dist, y: dy / dist }; 
    } else {
      return {x:0,y:0};
    }
}

/**
 * Generates a random between 1 and n
 * @param n the limit that the random number gets to
 * @return int random number between 1 and n
 */
function randomInt(n) {
    return Math.floor(Math.random() * n);
}

/**
 * Calculates the point of interception for one object starting at point
 * <code>a</code> with speed vector <code>v</code> and another object
 * starting at point <code>b</code> with a speed of <code>s</code>.
 * 
 * @see <a
 *      href="http://jaran.de/goodbits/2011/07/17/calculating-an-intercept-course-to-a-target-with-constant-direction-and-velocity-in-a-2-dimensional-plane/">Calculating
 *      an intercept course to a target with constant direction and velocity
 *      (in a 2-dimensional plane)</a>
 * 
 * @param a
 *            start vector of the object to be intercepted
 * @param v
 *            speed vector of the object to be intercepted
 * @param b
 *            start vector of the intercepting object
 * @param s
 *            speed of the intercepting object
 * @return vector of interception or <code>null</code> if object cannot be
 *         intercepted or calculation fails
 * 
 * @author Jens Seiler
 */
calculateInterceptionPoint = function(a, v, b, s) {

        // x difference between a and b
        var ox = a.x - b.x;
        // y difference between a and b
        var oy = a.y - b.y;

        var h1 = v.x * v.x + v.y * v.y - s * s;
        var h2 = ox * v.x + oy * v.y;
        var t;

        if (h1 == 0) { // problem collapses into a simple linear equation 
            t = -(ox * ox + oy * oy) / 2*h2;
        } else { // solve the quadratic equation
            var minusPHalf = h2 / h1;
            var discriminant = minusPHalf * minusPHalf - (ox * ox + oy * oy) / h1; // term in brackets is h3

            if (discriminant < 0) { // no (real) solution then...
                return null;
            }
 
            var root = Math.sqrt(discriminant);
 
            var t1 = minusPHalf + root;
            var t2 = minusPHalf - root;
 
            var tMin = Math.min(t1, t2);
            var tMax = Math.max(t1, t2);
 
            t = tMin > 0 ? tMin : tMax; // get the smaller of the two times, unless it's negative
            if (t < 0) { // we don't want a solution in the past
                return null;
            }
        }
 
        // calculate the point of interception using the found intercept time and return it
        return answer = {x : (a.x + t * v.x), y : (a.y + t * v.y)};
    };