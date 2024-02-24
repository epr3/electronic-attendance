import DataTableDropdown from "~/components/organisms/DataTable/DataTableDropdown.vue";
import { type ColumnDef } from "@tanstack/vue-table";
import type { ROLE, Subject, User } from "~/database/schema";

export const useColumnDefs = () => {
  const route = useRoute();

  const schoolYearColumns: ColumnDef<{
    id: string;
    startDate: string;
    endDate: string;
  }>[] = [
    {
      accessorKey: "startDate",
      header: "Start Date",
    },
    {
      accessorKey: "endDate",
      header: "End Date",
    },
    {
      id: "actions",

      enableHiding: false,
      cell: ({ row }) => {
        const id = row.original.id;
        return h(
          "div",
          { class: "relative" },
          h(DataTableDropdown, {
            apiUrl: api.years.id(id)({
              schoolId: route.params.id as string,
            }),
            editUrl: routes.years.get(id)({
              schoolId: route.params.id as string,
            }),
          })
        );
      },
    },
  ];

  const subjectColumns: ColumnDef<Subject>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      id: "actions",

      enableHiding: false,
      cell: ({ row }) => {
        const id = row.original.id;
        return h(
          "div",
          { class: "relative" },
          h(DataTableDropdown, {
            apiUrl: api.subjects.id(id)({
              schoolId: route.params.id as string,
            }),
            editUrl: routes.subjects.get(id)({
              schoolId: route.params.id as string,
            }),
          })
        );
      },
    },
  ];
  const userColumns: ColumnDef<
    Omit<User, "createdAt" | "updatedAt" | "mfaEnabled"> & {
      role: ROLE;
    }
  >[] = [
    {
      accessorKey: "firstName",
      header: "First Name",
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "telephone",
      header: "Telephone",
    },
    {
      accessorKey: "verifiedAt",
      header: "Verified At",
    },
    {
      id: "actions",
      enableHiding: false,

      cell: ({ row }) => {
        const id = row.original.id;
        return h(
          "div",
          { class: "relative" },
          h(DataTableDropdown, {
            apiUrl: api.users.id(id)({ schoolId: route.params.id as string }),
            editUrl: routes.users.get(id)({
              schoolId: route.params.id as string,
            }),
          })
        );
      },
    },
  ];
  return { userColumns, subjectColumns, schoolYearColumns };
};
