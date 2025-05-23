import { registry } from "@web/core/registry";
import {
    Many2ManyTagsAvatarField,
    many2ManyTagsAvatarField,
} from "@web/views/fields/many2many_tags_avatar/many2many_tags_avatar_field";
import { useSpecialData } from "@web/views/fields/relational_utils";
import { AttendeeTagsList } from "@calendar/views/fields/attendee_tags_list";

const ICON_BY_STATUS = {
    accepted: "fa-check",
    declined: "fa-times",
    tentative: "fa-question",
};
export class Many2ManyAttendee extends Many2ManyTagsAvatarField {
    static template = "calendar.Many2ManyAttendee";
    static components = {
        ...Many2ManyAttendee.components,
        TagsList: AttendeeTagsList,
    };
    setup() {
        super.setup();
        this.specialData = useSpecialData((orm, props) => {
            const { context, name, record } = props;
            return orm.call(
                "res.partner",
                "get_attendee_detail",
                [record.data[name].records.map((rec) => rec.resId), [record.resId || false]],
                {
                    context,
                }
            );
        });
    }

    get tags() {
        const partnerIds = this.specialData.data;
        const noEmailPartnerIds = this.props.record.data.invalid_email_partner_ids
            ? this.props.record.data.invalid_email_partner_ids.records
            : [];
        const tags = super.tags.map((tag) => {
            const partner = partnerIds.find((partner) => tag.resId === partner.id);
            const noEmail = noEmailPartnerIds.find((partner) => (tag.resId == partner.resId));
            if (partner) {
                tag.status = partner.status;
                tag.statusIcon = ICON_BY_STATUS[partner.status];
            }
            if (noEmail) {
                tag.noEmail = true;
            }
            return tag;
        });

        const organizer = partnerIds.find((partner) => partner.is_organizer);
        if (organizer) {
            const orgId = organizer.id;
            // sort elements according to the partner id
            tags.sort((a, b) => {
                const a_org = a.resId === orgId;
                return a_org ? -1 : 1;
            });
        }
        return tags;
    }
}

export const many2ManyAttendee = {
    ...many2ManyTagsAvatarField,
    component: Many2ManyAttendee,
    additionalClasses: ["o_field_many2many_tags_avatar", "w-100"],
};

registry.category("fields").add("many2manyattendee", many2ManyAttendee);
