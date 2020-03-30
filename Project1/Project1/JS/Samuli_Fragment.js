let Shaders = {};

Shaders.ShaderA = {
    vertexShader:
        `varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }`,
    fragmentShader:`
    varying vec2 vUv;

    
       //local variable red
       void main() {
        float PI = 3.14159265359;
        float index = vUv.x;
    
        vec3 greenRed = vec3(abs(cos(index*2.0)), abs(sin(index*1.5)), 0.0);
        gl_FragColor = vec4( greenRed, 1.0 );    //alpha is 0.75
        }`

    };

    Shaders.ShaderB = {
        vertexShader:
        `varying vec2 vUv;
        
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }`,
    fragmentShader:`
    varying vec2 vUv;
    const float PI = 3.14159265358979;
    
       //local variable red
       void main() {
        float indexX = vUv.x;
    
        vec3 greenRed = vec3(abs(cos(indexX*PI*15.0)), abs(sin(indexX*PI*15.0)), 0.0);
        gl_FragColor = vec4( greenRed, 1.0 );
        }`
    };

    Shaders.ShaderC = {
        uniforms: {
            'time': { type: 'f', value: 0.0}  
          },
        vertexShader:
            `varying vec2 vUv;

            //to facilitate sending data to fragment shader
            void main() {
                vUv = uv;
                //sends the uv value to the fragment program
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }`,
        fragmentShader:
            `varying vec2 vUv;
            const float PI = 3.14159265358979;
            uniform float time;
            void main() {
                float indexX = vUv.x;
    
                vec3 greenRed = vec3(abs(sin(indexX*time*15.0)), abs(cos(indexX*time*15.0)), 0.0);
                gl_FragColor = vec4( greenRed, 1.0 );
            }`
            
    };
    Shaders.ShaderD = {
        uniforms: {
            'time': { type: 'f', value: 0.0}  
          },
        vertexShader:
            `varying vec2 vUv;

            //to facilitate sending data to fragment shader
            void main() {
                vUv = uv;
                //sends the uv value to the fragment program
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }`,
        fragmentShader:
            `varying vec2 vUv;
            const float PI = 3.14159265358979;
            uniform float time;
            void main() {
                float indexX = vUv.x;
                float indexY = vUv.y;
    
                vec3 greenRed = vec3(abs(sin(indexY*PI*15.0)), abs(cos(indexY*PI*15.0)), 0.0);
                gl_FragColor = vec4( greenRed, abs(tan(indexY*time*1.5)) );
            }`
            
    };
