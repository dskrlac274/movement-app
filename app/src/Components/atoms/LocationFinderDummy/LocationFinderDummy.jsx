import { useMapEvents } from "react-leaflet";

const LocationFinderDummy = ({ setLatLng }) => {
  const map = useMapEvents({
    click(e) {
      console.log(e.latlng);
      setLatLng(e.latlng);
      return e.latlng;
    },
  });
  return null;
};

export default LocationFinderDummy;
