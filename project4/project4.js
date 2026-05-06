var raytraceFS = `
struct Ray {
	vec3 pos;
	vec3 dir;
};

struct Material {
	vec3  k_d;	// diffuse coefficient
	vec3  k_s;	// specular coefficient
	float n;	// specular exponent
};

struct Sphere {
	vec3     center;
	float    radius;
	Material mtl;
};

struct Light {
	vec3 position;
	vec3 intensity;
};

struct HitInfo {
	float    t;
	vec3     position;
	vec3     normal;
	Material mtl;
};

uniform Sphere spheres[ NUM_SPHERES ];
uniform Light  lights [ NUM_LIGHTS  ];
uniform samplerCube envMap;
uniform int bounceLimit;

bool IntersectRay( inout HitInfo hit, Ray ray );

// Shades the given point and returns the computed color.
vec3 Shade( Material mtl, vec3 position, vec3 normal, vec3 view )
{
	vec3 color = vec3(0,0,0);
	
	HitInfo hit;
	Ray ray;
	ray.pos = position;

	for ( int i=0; i<NUM_LIGHTS; ++i ) {
		// TO-DO: Check for shadows
		// TO-DO: If not shadowed, perform shading using the Blinn model
		Light cur_light = lights[i];
		
		ray.dir = cur_light.position - position;
		bool is_shadowed = IntersectRay(hit, ray);
		
		if (!is_shadowed || hit.t > 1.0){

			vec3 light_dir = normalize(cur_light.position - position);
			vec3 h = normalize(light_dir + view);
			float cosphi = max(0.0, dot(normal, h));
			float costheta = max(0.0, dot(normal, light_dir));
			color += cur_light.intensity * (costheta * mtl.k_d + mtl.k_s * pow(cosphi, mtl.n));
		}
		

		//color += mtl.k_d * lights[i].intensity;	// change this line
	}
	return color;
}

// Intersects the given ray with all spheres in the scene
// and updates the given HitInfo using the information of the sphere
// that first intersects with the ray.
// Returns true if an intersection is found.
bool IntersectRay( inout HitInfo hit, Ray ray )
{
	hit.t = 1e30;
	bool foundHit = false;
	float t = 1e30;

	float a = dot(ray.dir, ray.dir);

	for ( int i=0; i<NUM_SPHERES; ++i ) {
		// TO-DO: Test for ray-sphere intersection
		// TO-DO: If intersection is found, update the given HitInfo
		Sphere cur_sphere = spheres[i];

		vec3 center_to_pos = ray.pos - cur_sphere.center;
		float b = 2.0 * dot(ray.dir, (center_to_pos));
		float c = dot(center_to_pos, center_to_pos) - cur_sphere.radius*cur_sphere.radius;
		float delta = b*b - 4.0*a*c;

		if (delta >= 0.0){
			
			float new_t = (-b - sqrt(delta))/(2.0*a);

			if (new_t < t && new_t > 0.001){
				foundHit = true;
				t = new_t;
				vec3 position = ray.pos + t * ray.dir;

				hit.t = t;
				hit.position = position;
				hit.normal = normalize(position - cur_sphere.center);
				hit.mtl = cur_sphere.mtl;
			}
		}
	
	}
	return foundHit;
}

vec3 calculate_reflection(vec3 norm, vec3 dir){
	return 2.0*dot(dir, norm)*norm - dir;
}

// Given a ray, returns the shaded color where the ray intersects a sphere.
// If the ray does not hit a sphere, returns the environment color.
vec4 RayTracer( Ray ray )
{
	HitInfo hit;
	Ray r;	// this is the reflection ray
	HitInfo h;	// reflection hit info

	if ( IntersectRay( hit, ray ) ) {
		vec3 view = normalize( -ray.dir );
		vec3 clr = Shade( hit.mtl, hit.position, hit.normal, view );
		
		r.pos = hit.position;
		r.dir = calculate_reflection(hit.normal, -ray.dir);

		// Compute reflections
		vec3 k_s = hit.mtl.k_s;
		for ( int bounce=0; bounce<MAX_BOUNCES; ++bounce ) {
			if ( bounce >= bounceLimit ) break;
			if ( hit.mtl.k_s.r + hit.mtl.k_s.g + hit.mtl.k_s.b <= 0.0 ) break;
			
			// TO-DO: Initialize the reflection ray

			if ( IntersectRay( h, r ) ) {
				// TO-DO: Hit found, so shade the hit point
				// TO-DO: Update the loop variables for tracing the next reflection ray
				vec3 bounce_view = normalize(-r.dir)
				clr += Shade(h.mtl, h.position, h.normal, bounce_view);
				r.pos = h.position;
				r.dir = calculate_reflection(h.normal, -r.dir);
			} else {
				// The refleciton ray did not intersect with anything,
				// so we are using the environment color
				clr += k_s * textureCube( envMap, r.dir.xzy ).rgb;
				break;	// no more reflections
			}
		}
		return vec4( clr, 1 );	// return the accumulated color, including the reflections
	} else {
		return vec4( textureCube( envMap, ray.dir.xzy ).rgb, 0 );	// return the environment color
	}
}
`;