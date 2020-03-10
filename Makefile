#Backup data
backup:
	node src/commands/mongo-db/backup-prod-db.js

# Enrich images
image:
	node src/enrich-content/enrich-image.js

# Get data from Google search volume
gsc:
	node src/google-search-console/query.js

# Update GSC data
gsc-update:
	node src/google-search-console/update-data.js
