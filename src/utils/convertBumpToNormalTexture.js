'use strict'

import compositeStrokeVert from '../../shaders/composite-strokes.vert.glsl'

function createConvertBumpToNormalTexture(self)
{
	return self.regl({
		vert: compositeStrokeVert,

		frag: `
			precision highp float;

			uniform sampler2D normalTex;
			uniform sampler2D geoNormalTex;
			uniform sampler2D geoTangentTex;
			uniform vec2 pixelStep;
			varying vec2 uv;

			void main() {
				
				vec4 clr = texture2D(normalTex, uv);
				{
					vec3 ng = normalize(( texture2D(geoNormalTex, uv).xyz*2.0 - 1.0 ));
					vec3 t = normalize(( texture2D(geoTangentTex, uv).xyz*2.0 - 1.0 ));
					vec3 b = normalize(cross(ng, t));
					mat3 tbn = mat3(t, b, ng);

					vec2 uvT = normalize(t.xy)*pixelStep;
					vec2 uvB = normalize(b.xy)*pixelStep;
			
					float me = clr.x;
					float n = texture2D(normalTex, uv - uvB).x;
					float s = texture2D(normalTex, uv + uvB).x;
					float e = texture2D(normalTex, uv + uvT).x;
					float w = texture2D(normalTex, uv - uvT).x;
			
					float bumpB = ((n-me)-(s-me));
					float bumpT = ((e-me)-(w-me));
		
	
					// vec3 ng = vec3(0.0, 0.0, 1.0);
					ng = vec3(0.0, 0.0, 1.0);

					
					if (bumpT + bumpB != 0.0)
					{
						// vec3 normalOffset = (bumpB*b + bumpT*t);
						// ng += normalOffset;
						ng.y = bumpT;
						ng.x = bumpB;
						// ng = normalize(ng);
					}

					gl_FragColor = vec4((ng+1.0)/2.0, 1.0);
	
				}
			}`,

		depth: {
			enable: false,
			// func: self.regl.prop('depthFunc')
		},
		stencil: {
			enable: false,
		},
		attributes: {
			position: [ -4, -4, 4, -4, 0, 4 ]
		},
		count: 3,

		// this converts the vertices of the mesh into the position attribute
		// attributes: {
		// 	position: self.regl.prop('verticesBuffer'),
		// 	uv: self.regl.prop('uvsBuffer')
		// },

		// and this converts the faces of the mesh into elements
		// elements: self.regl.prop('indeces'),

		uniforms: {
			normalTex: self.regl.prop('normalTex'),
			geoNormalTex: self.regl.prop('geoNormalTex'),
			geoTangentTex: self.regl.prop('geoTangentTex'),
			pixelStep: ({framebufferWidth, framebufferHeight}) => [1.0/framebufferWidth, 1.0/framebufferHeight],
		}
	})
}

export {createConvertBumpToNormalTexture};
