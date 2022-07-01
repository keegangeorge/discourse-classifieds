import EmberObject from "@ember/object";
import { ajax } from "discourse/lib/ajax";
import { popupAjaxError } from "discourse/lib/ajax-error";

const Classifieds = EmberObject.extend({});

Classifieds.reopenClass({
  list() {
    return ajax(`/classifieds.json`)
      .then((result) => {
        const classifiedsData = [];
        const classifieds = result.classifieds;
        classifieds.forEach((item) => {
          const listingDetails = JSON.parse(item.listingDetails);
          const images = Object.values(listingDetails.images).flat();

          classifiedsData.push({
            id: item.id,
            title: listingDetails.title,
            price: listingDetails.price,
            location: listingDetails.location,
            description: listingDetails.description,
            condition: listingDetails.condition,
            images,
            coverImage: listingDetails.images[0],
            categoryId: item.category_id,
            topicTitle: item.fancy_title,
            isClassifiedListing: item.isClassifiedListing,
            listingStatus: item.listingStatus,
            slug: item.slug,
            userId: item.user_id,
            views: item.views,
            updatedAt: item.updated_at,
            createdAt: item.created_at,
            likeCount: item.like_count,
          });
          result.classifiedsData = classifiedsData;
        });
        return result.classifiedsData;
      })
      .catch(popupAjaxError);
  },
});

export default Classifieds;
