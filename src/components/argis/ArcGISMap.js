import React, { useEffect, useRef, useState } from 'react';
import requestApi from '../../helpers/api';
import ReadingChart from '../ReadingChart';


const ArcGISMap = ({ sensors, readings }) => {
  const mapRef = useRef(null);
  const [sensorInfo, setSensorInfo] = useState([]);
  useEffect(() => {
    let view;

    const gltfFile = '/assets/images/sensor.glb'; // Đường dẫn chính xác tới tệp GLB
    const redimg = '/assets/images/red.glb'; // Đường dẫn chính xác tới tệp GLB
    const blueimg = '/assets/images/blue.glb'; // Đường dẫn chính xác tới tệp GLB
    const handleArcGISLoad = () => {
      window.require([
        "esri/Map",
        "esri/views/SceneView",
        "esri/layers/GraphicsLayer",
        "esri/geometry/Mesh",
        "esri/geometry/Point",
        "esri/Graphic"
      ], (Map, SceneView, GraphicsLayer, Mesh, Point, Graphic) => {
        
        console.log('Sensors:', sensors);
        console.log('Readings:', readings);

        const sketchLayer = new GraphicsLayer({
          elevationInfo: {
            mode: "absolute-height"
          },
          title: "Sketched geometries"
        });

        const map = new Map({
          basemap: "topo-vector",
          ground: "world-elevation"
        });

        view = new SceneView({
          container: mapRef.current,
          map: map,
          camera: {
            position: {
              latitude: 10.7145,
              longitude: 106.725977,
              z: 6000
            },
            heading: 0,
            tilt: 50
          }
        });

        // Thêm mô hình cho mỗi cảm biến
        sensors.forEach(sensor => {
          const modelPoint = new Point({
            latitude: sensor.latitude,
            longitude: sensor.longitude,
            z: sensor.z || 3
          });

          Mesh.createFromGLTF(modelPoint, gltfFile).then(mesh => {
            mesh.scale(2, { origin: modelPoint });
            const measureThisAction = {
              title: "Chart",
              id: "show-img",
              image: '/assets/images/water-level.png'
            };

            const graphic = new Graphic({
              geometry: mesh,
              symbol: {
                type: "mesh-3d",
                symbolLayers: [{
                  type: "fill",
                  material: { color: [255, 255, 255, 0.8] }
                }]
              },
              attributes: {
                name: sensor.name,
                id: sensor.id,
                desc: sensor.description,
                waterLevel: sensor.region?.damage_level,
                createAt: sensor.created_at,
                updateAt: sensor.created_at,
              },
              popupTemplate: {
                title: "Sensor Information",
                content: `
                 <div class="card text-white bg-info mb-3">
                  <div class="card-header">
                    <h5 class="card-title">{name}</h5>
                  </div>
                  <div class="card-body">
                    <table class="table table-borderless text-white">
                      <tbody>
                        <tr>
                          <td><b>Sensor Id:</b></td>
                          <td><strong>{id}</strong></td>
                        </tr>
                        <tr>
                          <td><b>Damage Level:</b></td>
                          <td><strong>{waterLevel} m</strong></td>
                        </tr>
                        <tr>
                          <td><b>Description:</b></td>
                          <td>{desc}</td>
                        </tr>
                        <tr>
                          <td><b>Create At:</b></td>
                          <td>{createAt}</td>
                        </tr>
                        <tr>
                          <td><b>Update At:</b></td>
                          <td>{updateAt}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                `,
                actions: [measureThisAction]
              }
            });

            sketchLayer.add(graphic);
          }).catch(console.error);
        });
            

          sensors.forEach(sensor => {
              const matchingReading = readings.find(reading => reading.sensor.id === sensor.id);
              const hide = (matchingReading?.water_level - sensor.region?.damage_level) > 0; 
              if (matchingReading && hide) {
                const modelPoint = new Point({
                  latitude: sensor.latitude,
                  longitude: sensor.longitude,
                  z: sensor.z || 3
                });

                const level = matchingReading.water_level - sensor.region?.damage_level;
                const randomScale = Math.floor(Math.random() * 4) + 2;

                const gltfWarning = level > 2 ?  redimg : blueimg ;
                console.log(gltfWarning)
                Mesh.createFromGLTF(modelPoint, gltfWarning).then(function(mesh) {
                  mesh.scale(randomScale, { origin: modelPoint });
                  mesh.rotate(0, 0, 0);
    
                  const graphicReading = new Graphic({
                    geometry: mesh,
                    symbol: {
                      type: "mesh-3d",
                      symbolLayers: [{ type: "fill", material: { color: [255, 255, 255, 0.8] } }]
                    },
                    attributes: {
                      name: sensor.name,
                      desc: sensor.description,
                      waterLevel: matchingReading.water_level,
                      damageLevel: sensor.region?.damage_level,
                      warning: level > 2 ? 'Báo Động Mức 1 ' : 'Báo Động Mức 2' ,
                      createAt: matchingReading.updated_at
                    },
                    popupTemplate: {
                      title: `<b>Warning Information</b>
                       <p class="card-text"><small class="text-muted">Create at: {createAt}</small></p>
                      `,
                      content: `
                       <div class="card text-white ${(level > 2) ? 'bg-danger' : 'bg-primary'} mb-3">
                        <div class="card-header">
                          <h3 class="card-title">{warning}</h3>
                        </div>
                        <div class="card-body">
                          <table class="table table-borderless text-white">
                            <tbody>
                              <tr>
                                <td><b>Sensor Name:</b></td>
                                <td>{name}</td>
                              </tr>
                              <tr>
                                <td><b>Description:</b></td>
                                <td>{desc}</td>
                              </tr>
                              <tr>
                                <td><b>Water Level:</b></td>
                                <td><strong>{waterLevel} m</strong></td>
                              </tr>
                              <tr>
                                <td><b>DamageLevel:</b></td>
                                <td><strong>{damageLevel} m</strong></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
      
                      `
                    }
                  });
    
                  sketchLayer.add(graphicReading);
                }).catch(console.error);
              }
            });
          view.on("click", (event) => {
            view.hitTest(event).then((response) => {
              if (response.results.length > 0) {
                const graphic = response.results[0].graphic;
                const id = graphic.attributes.id; 
                if(id) {
                  console.log('click Sensor ID:', id);
                  fetchSensorReadings(id)
                }else {
                  setSensorInfo([])
                }
              }
            });
            });

        view.ui.remove("credits");
        map.add(sketchLayer);
      });
    };

    

    if (window.require) {
      handleArcGISLoad();
    } else {
      console.error('ArcGIS API has not been loaded');
    }

    return () => {
      if (view) {
        view.destroy();
        view = null;
      }
    };
  }, [sensors, readings]);

  const fetchSensorReadings = async (sensorId) => {
    const Id = parseInt(sensorId)
    try {
      const response = await requestApi(`/readings/sensor/${Id}`,'GET');
      const readingsData = response.data;
      console.log(readingsData)
      setSensorInfo(readingsData);
    } catch (error) {
      console.error("Error fetching sensor readings:", error);
    }
  };

  return (<div id='mapDiv' ref={mapRef} style={{ height: '100vh' }}>

      {sensorInfo[0] && (
        <div style={{
          position: 'absolute',
          top: '17px',
          right: '17px',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          border: '1px solid #ccc',
          borderRadius: '5px',
          padding: '10px',
          width: '600px',
          height: '400px',
          zIndex: 1000,
          color: 'blue'
        }}>
        <div class="card">
            <h5 class="card-header">{sensorInfo[0].sensor.name}</h5>

            <div class="card-body">
            <ReadingChart data={sensorInfo} />
            </div>
        </div>
          
        </div>
      )}

    </div>
       

  )
};

export default ArcGISMap;
