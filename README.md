# rad-to-json
A JS library to parse RADIANCE input files into JSON.

This library can be used to convert radiance files to JSON format. The standard JSON schema is put together as a need for [Honeybee[+]]() library. There is no claim that this is the correct JSON schema for Radiance primitives but we need one to get started!

The output JSON object is structured as:

```javascript
{
  "surfaces": [{}, .., {}],  // all supported surface types (e.g. polygon, sphere, ..)
  "materials": [{}, .., {}], // all supported materials (e.g. plastic, glass, ..)
  "other": [{}, .., {}]   // all those objects which are not currently supported. See Generic schema.
}
```


You can see it in action [here](https://www.mostapha.io/rad-to-json/)!

The current goal of the project is to provide easy to read input files for [RAD to Three.js viewer](https://github.com/ladybug-tools/spider/tree/master/cookbook/rad-to-threejs) which is an on-going project developed by [Theo](https://github.com/theo-armour).


# RadJSON

Here is an overview of `RadJSON` schema.

## Generic

This schema will be used for any primitives that are not currently supported by *rad-to-json*. See [this page](http://radsite.lbl.gov/radiance/refer/ray.html#Primitive) for the list of all radiance primitive types.

`Radiance`
```
modifier type identifier
n S1 S2 "S 3" .. Sn
0
m R1 R2 R3 .. Rm
```

`RadJSON`
```javascript
{
    "modifier": string,
    "type": string,
    "name": string,
    "values": {
      "0": [S1, S2, "S 3", .., Sn],
      "1": [],
      "2": [R1, R2, R3, .., Rm]
    }
}
```


# Supported Surface Types

## Polygon

A polygon is given by a list of three-dimensional vertices, which are ordered counter-clockwise as viewed from the front side (into the surface normal). The last vertex is automatically connected to the first. Holes are represented in polygons as interior vertices connected to the outer perimeter by coincident edges (seams).

`Radiance`
```
mod polygon id
0
0
3n
        x1      y1      z1
        x2      y2      z2
        ...
        xn      yn      zn
```

`RadJSON`
```javascript
{
    "modifier": string,
    "type": "polygon",
    "name": string,
    "vertices": [
              {"x": float, "y": float, "z": float},
              {"x": float, "y": float, "z": float},
              ..,
              {"x": float, "y": float, "z": float}
            ]
}
```


## Sphere

A sphere is given by its center and radius:

`Radiance`
```
mod sphere id
0
0
4 xcent ycent zcent radius
```

`RadJSON`
```javascript
{
    "modifier": string,
    "type": "sphere",
    "name": string,
    "center_pt": {"x": float, "y": float, "z": float},
    "radius": float
}
```


## Cone

A cone is a megaphone-shaped object. It is truncated by two planes perpendicular to
its axis, and one of its ends may come to a point. It is given as two axis endpoints,
and the starting and ending radii:

`Radiance`
```
mod cone id
0
0
8
        x0      y0      z0
        x1      y1      z1
        r0      r1
```

`RadJSON`
```javascript
{
  "type": "cone",
  "modifier": string,
  "name": string,
  "center_pt_start": {"x": float, "y": float, "z": float},
  "radius_start": float,
  "center_pt_end": {"x": float, "y": float, "z": float},
  "radius_end": float
}
```


## Cylinder

A cylinder is like a cone, but its starting and ending radii are equal.

`Radiance`
```
mod cylinder id
0
0
7
       x0      y0      z0
       x1      y1      z1
       rad
```
`RadJSON`
```javascript
{
    "type": "cylinder",
    "modifier": string,
    "name": string,
    "center_pt_start": {"x": float, "y": float, "z": float},
    "center_pt_end": {"x": float, "y": float, "z": float},
    "radius": float
}
```

# Supported Material Types

## Plastic

Plastic is a material with uncolored highlights. It is given by its RGB reflectance, its fraction of specularity, and its roughness value. Roughness is specified as the rms slope of surface facets. A value of 0 corresponds to a perfectly smooth surface, and a value of 1 would be a very rough surface. Specularity fractions greater than 0.1 and roughness values greater than 0.2 are not very realistic. (A pattern modifying plastic will affect the material color.)

`Radiance`
```
mod plastic id
0
0
5 red green blue spec rough
```
`RadJSON`
```javascript
{
  "modifier": string, // material modifier (Default: "void")
  "type": "plastic", // Material type
  "name": string, // Material Name
  "r_reflectance": float, // Reflectance for red
  "g_reflectance": float, // Reflectance for green
  "b_reflectance": float, // Reflectance for blue
  "specularity": float, // Material specularity
  "roughness": float // Material roughness
}
```

## Glass
Glass is similar to dielectric, but it is optimized for thin glass surfaces (n = 1.52). If a fourth real argument is given, it is interpreted as the index of refraction to use instead of 1.52.

`Radiance`
```
mod glass id
0
0
3 rtn gtn btn
```
`RadJSON`
```javascript
{
  "modifier": string, // material modifier (Default: "void")
  "type": "glass",
  "name": string, // Material Name
  "r_transmittance": float, // Transmittance for red
  "g_transmittance": float, // Transmittance for green
  "b_transmittance": float, // Transmittance for blue
  "refraction": float // Index of refraction - default 1.52
}
```

## Metal

Metal is similar to plastic, but specular highlights are modified by the material color. Specularity of metals is usually .9 or greater. As for plastic, roughness values above .2 are uncommon.

`Radiance`
```
mod metal id
0
0
5 red green blue spec rough
```
`RadJSON`
```javascript
{
  "modifier": string, // material modifier (Default: "void")
  "type": "metal", // Material type
  "name": string, // Material Name
  "r_reflectance": float, // Reflectance for red
  "g_reflectance": float, // Reflectance for green
  "b_reflectance": float, // Reflectance for blue
  "specularity": float, // Material specularity
  "roughness": float // Material roughness
}
```

## Trans
Trans is a translucent material, similar to plastic. The transmissivity is the fraction of penetrating light that travels all the way through the material. The transmitted specular component is the fraction of transmitted light that is not diffusely scattered. Transmitted and diffusely reflected light is modified by the material color. Translucent objects are infinitely thin.

`Radiance`
```
mod trans id
0
0
7 red green blue spec rough trans tspec
```
`RadJSON`
```javascript
{
  "modifier": string, // material modifier (Default: "void")
  "type": "trans", // Material type
  "name": string, // Material Name
  "r_reflectance": float, // Reflectance for red
  "g_reflectance": float, // Reflectance for green
  "b_reflectance": float, // Reflectance for blue
  "specularity": float, // Material specularity
  "roughness": float, // Material roughness
  "transmitted_diff": float,
  "transmitted_spec": float
}
```

## Glow
Glow is used for surfaces that are self-luminous, but limited in their effect. In addition to the radiance value, a maximum radius for shadow testing is given:

`Radiance`
```
mod glow id
0
0
4 red green blue maxrad
```
`RadJSON`
```javascript
{
  "modifier": string, // material modifier (Default: "void")
  "type": "glow", // Material type
  "name": string, // Material Name
  "red": float, // A positive value for the Red channel of the glow
  "green": float, // A positive value for the Green channel of the glow
  "blue": float, // A positive value for the Blue channel of the glow
  "radius": float // Maximum radius for shadow testing
}
```

## Mirror
Mirror is used for planar surfaces that produce virtual source reflections.

`Radiance`
```
mod mirror id
1 material
0
3 red green blue
```
`RadJSON`
```javascript
{
  "modifier": string, // material modifier (Default: "void")
  "type": "mirror", // Material type
  "name": string, // Material Name
  "r_reflectance": float, // Reflectance for red
  "g_reflectance": float, // Reflectance for green
  "b_reflectance": float  // Reflectance for blue
}
```
