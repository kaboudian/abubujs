## What is _Abubu.js_?
**_Abubu.js_** is a JavaScript library for scientific computing using WebGL 2.0. It is actively developed [Dr. Abouzar Kaboudian](http://abouzar.net/) currently at Georgia Tech's [CHAOS Lab](http://chaos.gatech.edu/). Abubu.js was originally developed to facilitate cardiac simulations using the GPU.

As [Dr. Kaboudian](http://abouzar.net/) started the development of the cardiac elecrophysiological models using WebGL 2.0, it quickly became clear to him that a lot of the details of problem setup and the GPU pipeline setup was not as much of interest to him as the solution of the models were. He was mostly interested in the real-time simulations and he wanted to be able to interact with the simulations. Subsequently, he started to develop functions that would facilitate his simulations and remove as much as WebGL detail from the JavaScript code and allow him to concentrate on just shader designs and the numerical schemes. 

The project quickly turned into a library of functions that he would use on a daily basis. He initially called his library _Compute.js_, and as other lab members started to use the library, [Prof. Flavio H. Fenton](http://dev1.thevirtualheart.org/About+Us/Flavio+Fenton.html) refused to accept _Compute.js_ as the library name claiming he should use his nickname in the in the name of the library. Prof. Fenton put the name **_Abubu.js_** to vote in the CHAOS Lab and it was accepted unanimously by members.

_Abubu.js_ quickly proved to be useful in many other scientific applications and it was decided that it should be released as an Open Source package to the scientific community. It was initially released for scientific use with the publication of this [journal article](https://doi.org/10.1126/sciadv.aav6019).


The latest version of the library can now be downloaded from [http://abubujs.org/libs/Abubu.latest.js](http://abubujs.org/libs/Abubu.latest.js). 

We hope that you can adopto **_Abubu.js_** in your research to accelerate the pace of your scientific computations.

## Credits & Acknowledgements
This code is developed by 
 * Abouzar Kaboudian
and tested on example models by
 * Flavio H. Fenton
 * Elizabeth M. Cherry 

<br>

We also include [dat.GUI](https://github.com/dataarts/dat.gui) for generating graphical user interfaces and [glMatrix](http://glmatrix.net/) for view point calculation in our 3D volume ray-caster.

## License 
**_Abubu.js_** is licensed under _MIT License_. See the [`LICENSE`](LICENSE) file for details.

If you are using this library in a publication, we ask you to cite our original publication as:

> Kaboudian, Abouzar, Elizabeth M. Cherry, and Flavio H. Fento. "Real-time interactive simulations of large-scale systems on personal computers and cell phones: Toward patient-specific heart modeling and other applications." _Science advances_ 5, no. 3 (2019), [https://doi.org/10.1126/sciadv.aav6019](https://doi.org/10.1126/sciadv.aav6019).
