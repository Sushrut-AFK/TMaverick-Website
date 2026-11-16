# Temporary Formula Student model

This is NOT Team Maverick's Avira 2.0. It is a temporary, licensed engineering demonstration requested by the site owner on 14 November 2026.

Upstream: https://github.com/simscape/Formula-Student-Vehicle-Simscape
Pinned commit: 6bcec3828e49102f21841b3239bfaf3632dfec8d
Author/copyright: The MathWorks, Inc. See the complete BSD redistribution licence in LICENSE.txt in this directory.

Geometry used:

- Libraries/Vehicle/Body/CAD/FSAE_Achilles/Parts/FSAE_Body.STL
- FSAE_Aero_Surfaces.STL, FSAE_Aero_Brackets.STL, FSAE_Rollbar.STL, FSAE_Seat.STL from that same directory
- Wheel vertices/faces from Scripts_Data/Plots/3DPlotter/Data/VehVisDataFSAE.mat
- Wheel centres and front/rear double-wishbone hardpoints from Scripts_Data/Data_Vehicle/Vehicle_data_dwpushrod.m

Adaptations: original CAD meshes converted to Y-up glTF; aero surface triangles grouped into front/rear/floor regions for animation; wheel geometry instanced at the source wheel centres; suspension links visualised as simple cylindrical tubes between the published hardpoints. The decorative material colours, lighting, component separation distances, and view are editorial choices. Exploded positions are illustrative assembly offsets, not manufacturing instructions. This model does not contain detailed engine or electronics internals; these are not invented.

The model file uses 35 nodes and shares wheel geometry. Source conversion scripts: scripts/read-mat.mjs and scripts/prepare-demo-model.mjs. Original retrieved source files are preserved in research/models. No MATLAB installation is needed to reproduce the conversion.

Replace demo.glb with the team's approved vehicle geometry to retire this demonstration. Each movable node carries extras.explode [x,y,z] in metres and extras.focus (department indices). Update the visible demo notice and this attribution when replacing the asset, as appropriate to the replacement's licence.
