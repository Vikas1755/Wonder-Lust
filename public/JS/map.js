window.initMap = function () {
  const geocoder = new google.maps.Geocoder();

  geocoder.geocode({ address }, (results, status) => {
    if (status === "OK") {
      const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: results[0].geometry.location,
        mapId: "YOUR_MAP_ID_HERE"
      });

      const radar = document.createElement('div');
      radar.classList.add('pulse-circle');

      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      svg.setAttribute("viewBox", "0 0 640 640");
      svg.setAttribute("width", "30");
      svg.setAttribute("height", "30");
      svg.style.opacity = "1";

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", "M320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM370.7 389.1L226.4 444.6C207 452.1 187.9 433 195.4 413.6L250.9 269.3C254.2 260.8 260.8 254.2 269.3 250.9L413.6 195.4C433 187.9 452.1 207 444.6 226.4L389.1 370.7C385.9 379.2 379.2 385.8 370.7 389.1zM352 320C352 302.3 337.7 288 320 288C302.3 288 288 302.3 288 320C288 337.7 302.3 352 320 352C337.7 352 352 337.7 352 320z");
      path.setAttribute("fill", "#ff5a5f");
      svg.appendChild(path);

      const container = document.createElement("div");
      container.style.position = "relative";
      container.style.display = "flex";
      container.style.alignItems = "center";
      container.style.justifyContent = "center";
      container.appendChild(radar);
      container.appendChild(svg);

      new google.maps.marker.AdvancedMarkerElement({
        map,
        position: results[0].geometry.location,
        content: container,
      });
    } else {
      alert("Geocoding failed: " + status);
    }
  });
};
