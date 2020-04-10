let Shaders = {};
//Lab 11: Part A 1.
Shaders.ShaderA = {
    uniforms: {
        'time': { type: 'f', value: 0.0}, 
        'textureA': {  value: null }
    },
    vertexShader:
        `varying vec2 vUv;
        uniform float time;
        uniform sampler2D textureA;

        void main() {
            vUv = uv;
            vec4 color = texture2D(textureA, vUv);
            vec3 pos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
        }`,
    fragmentShader:`
        varying vec2 vUv;
        uniform float time;
        uniform sampler2D textureA;
        const float PI = 3.14159265358979;

        void main() {
            

          
            vec4 color = texture2D(textureA, vUv);
            color.r = 0.65;
            color.g = 1.0-color.g;
            color.b = 0.0;
            color.a = 0.8;
            gl_FragColor = vec4(color);
            
        }`

};
//Lab 11: Part A 2.
Shaders.ShaderB = {
    uniforms: {
        'time': { type: 'f', value: 0.0}, 
        'textureA': {  value: null }
    },
    vertexShader:
        `varying vec2 vUv;
        uniform float time;
        uniform sampler2D textureA;

        void main() {
            vUv = uv;
            vec4 color = texture2D(textureA, vUv);
            vec3 pos = position;
            pos.z += abs(sin(color.r *5.0));
            gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
        }`,
    fragmentShader:`
        varying vec2 vUv;
        uniform float time;
	    uniform sampler2D textureA;
        const float PI = 3.14159265358979;

        void main() {
            vec4 color = texture2D(textureA, vUv);
            color.r = 0.65;
            color.g = 1.0-color.g;
            color.b = 0.0;
            color.a = 0.8;
            gl_FragColor = vec4(color);

        }`
};
//Lab 11: Part A 3.
Shaders.ShaderC = {
    uniforms: {
        'time': { type: 'f', value: 0.0}, 
        'textureA': {  value: null }
    },
    vertexShader:
        `varying vec2 vUv;
        uniform float time;
        uniform sampler2D textureA;

        void main() {
            vUv = uv;
            vec4 color = texture2D(textureA, vUv);
            vec3 pos = position;
            pos.z += abs(sin(color.r *10.0+time*2.0));

            //Uncomment the below line to have nice effect
            //pos.y += tan(color.r *10.0+time*2.0);
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
        }`,
    fragmentShader:
        `varying vec2 vUv;
        uniform float time;
        const float PI = 3.14159265358979;
	    uniform sampler2D textureA;

        void main() {
            vec4 color = texture2D(textureA, vUv);
            color.r = 0.65;
            color.g = 1.0-color.g;
            color.b = 0.0;
            color.a = 0.8;
            gl_FragColor = vec4(color);
        }`    
};